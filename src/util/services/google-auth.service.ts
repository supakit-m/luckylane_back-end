import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

// Client ID ของคุณที่ได้จาก Google Cloud Console
// คุณควรเก็บค่านีไว้ใน Environment Variables (.env)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    // สร้าง OAuth2Client instance โดยใช้ Client ID ของคุณ
    this.client = new OAuth2Client(CLIENT_ID);
  }

  /**
   * ตรวจสอบ ID Token และดึงข้อมูล Payload
   * @param idToken ID Token ที่ได้รับจาก Client-side
   * @returns ข้อมูล Payload (Claims) ที่ถูกตรวจสอบแล้ว
   */
  async verifyGoogleIdToken(idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException('ID Token is missing');
    }

    try {
      // 1. ตรวจสอบลายเซ็น (Signature Verification)
      // 2. ตรวจสอบ Issuer (iss)
      // 3. ตรวจสอบ Audience (aud) เทียบกับ Client ID ของเรา
      // 4. ตรวจสอบการหมดอายุ (exp)
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID, // ตรวจสอบว่า aud ตรงกับ Client ID นี้
      });

      // ดึง Payload (Claims)
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid ID Token Payload');
      }

      // 5. ตรวจสอบ email_verified
      if (payload.email_verified !== true) {
        throw new UnauthorizedException('Google email not verified');
      }

      // ส่งคืนข้อมูลผู้ใช้ที่จำเป็น
      return {
        sub: payload.sub, // Google User ID (ใช้เป็น ID หลัก)
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        // เพิ่มข้อมูลอื่นๆ ตามต้องการ
      };
    } catch (error) {
      console.error('ID Token Verification Error:', error.message);
      // โยน Exception สำหรับข้อผิดพลาดในการตรวจสอบ
      throw new UnauthorizedException('Google ID Token validation failed');
    }
  }
}
