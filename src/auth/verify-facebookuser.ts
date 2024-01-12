import axios from 'axios';

export class FacebookVerificationService {
    static async verifyAccessToken(token: string): Promise<any | null> {
        const appAccessToken = '1564274897054523|1b17d3d08887329d18aedc7a9f410544';
console.log(token);

        try {
            const response = await axios.get(`https://graph.facebook.com/debug_token`, {
                params: {
                    input_token: token,
                    access_token: appAccessToken,
                },
            });

            
            const { data } = response;

            if (data && data.data && data.data.is_valid) {
                const profileResponse = await axios.get(`https://graph.facebook.com/me`, {
                    params: {
                        fields: 'id,name,picture,email',
                        access_token: token,
                    },
                });

                const profileData = profileResponse.data;
                console.log('User Profile:', profileData);

                data.email = profileData.email;
                data.profile = {
                    id: profileData.id,
                    name: profileData.name,
                    picture: profileData.picture.data.url,
                    email: profileData.email
                };
                console.log(data);

                return data;
            }

            return null;
        } catch (error) {
            console.error('Error verifying Facebook Access Token:', error.message);
            return null;
        }
    }
}
