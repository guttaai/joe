import axios from 'axios';

interface TokenSocials
{
    twitter: string | null;
    telegram: string | null;
    website: string | null;
}

export class HtmlParser
{
    private static readonly TWITTER_REGEX = /\"twitter\":(?:\"([^\"]+)\"|null)/;
    private static readonly TELEGRAM_REGEX = /\"telegram\":(?:\"([^\"]+)\"|null)/;
    private static readonly WEBSITE_REGEX = /\"website\":(?:\"([^\"]+)\"|null)/;

    public static async extractTokenSocials(url: string): Promise<TokenSocials | null>
    {
        try
        {
            const response = await axios.get(url, {
                validateStatus: () => true
            });

            const html = response.data;

            const twitterMatch = this.TWITTER_REGEX.exec(html);
            const telegramMatch = this.TELEGRAM_REGEX.exec(html);
            const websiteMatch = this.WEBSITE_REGEX.exec(html);

            const result: TokenSocials = {
                twitter: twitterMatch ? twitterMatch[1] || null : null,
                telegram: telegramMatch ? telegramMatch[1] || null : null,
                website: websiteMatch ? websiteMatch[1] || null : null
            };

            return (result.twitter || result.telegram || result.website) ? result : null;

        } catch (error: any)
        {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }
}