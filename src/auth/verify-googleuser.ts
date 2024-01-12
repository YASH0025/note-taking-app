
import axios from 'axios';

export class GoogleVerificationService {
  static async verifyAccessToken(accessToken: string): Promise<any | null> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo`, {
        params: {
          access_token: accessToken,
        },
      });
console.log(accessToken);

      const { data } = response;

      if (data && data.expires_in > 0) {
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profileData = profileResponse.data;
        console.log('User Profile:', profileData);

        data.profile = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          picture: profileData.picture,
        };

        console.log("dataka kaghaidg ======",data) ;

        return data;
      }

      return null;
    } catch (error) {
      console.error('Error verifying Google Access Token:', error.message);
      return null;
    }
  }
}


// export class GoogleVerificationService {
//   static async verifyAccessToken(accessToken: string): Promise<any | null> {
//     try {
//       const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);

//       if (response.status === 200) {

//         // Access the displayName from the profilw
//         return response.data;
//       } else {
//         console.error('Google API Error:', response.status, response.statusText);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error verifying Google Access Token:', error.message);
//       return null;
//     }
//   }
// }








