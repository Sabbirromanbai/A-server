import "dotenv/config";
import { createRemoteJWKSet, errors, jwtVerify } from "jose";

let remoteJwkSet;
let remoteJwkSetUrl;

function getAuthConfiguration() {
  const configuredAuthUrl = process.env.BETTER_AUTH_URL?.trim();

  if (!configuredAuthUrl) {
    throw new Error("BETTER_AUTH_URL is not configured.");
  }

  let authUrl;
  try {
    authUrl = new URL(configuredAuthUrl);
  } catch {
    throw new Error("BETTER_AUTH_URL must be an absolute HTTP(S) URL.");
  }

  if (
    !["http:", "https:"].includes(authUrl.protocol) ||
    (process.env.NODE_ENV === "production" && authUrl.protocol !== "https:") ||
    authUrl.username ||
    authUrl.password
  ) {
    throw new Error(
      "BETTER_AUTH_URL must be an absolute HTTPS URL in production.",
    );
  }

  const betterAuthUrl = authUrl.origin;
  const jwksUrl = new URL("/api/auth/jwks", betterAuthUrl).toString();

  if (jwksUrl !== remoteJwkSetUrl) {
    remoteJwkSet = createRemoteJWKSet(new URL(jwksUrl));
    remoteJwkSetUrl = jwksUrl;
  }

  return { betterAuthUrl, jwks: remoteJwkSet };
}

export async function verifyToken(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  let configuration;
  try {
    configuration = getAuthConfiguration();
  } catch (error) {
    console.error("JWT authentication is not configured:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication is temporarily unavailable.",
    });
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(match[1], configuration.jwks, {
      issuer: configuration.betterAuthUrl,
      audience: configuration.betterAuthUrl,
    }));
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    console.error("JWT verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication is temporarily unavailable.",
    });
  }

  if (typeof payload.email !== "string" || !payload.email.trim()) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  req.user = payload;
  return next();
}
