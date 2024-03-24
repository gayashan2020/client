// lib/session.js

import jwt from 'jsonwebtoken';
import Cookies from 'cookie';

export async function getSession(req) {
  try {
    // Parse the cookies from the request
    const cookies = Cookies.parse(req ? req.headers.cookie || "" : document.cookie);

    // Verify and decode the token
    const session = jwt.verify(cookies.token, process.env.JWT_SECRET);

    return { user: session };
  } catch (error) {
    // If an error occurs, return null
    return null;
  }
}