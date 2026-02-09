# DNS Recovery Guide - nextsteplogic.com

Your website is currently showing an **NXDOMAIN** error, which means the domain isn't pointing to a server. Follow these steps in GoDaddy to restore your site.

## 1. Check your DNS Records
1. Log in to your **GoDaddy Control Panel**.
2. Select your domain: `nextsteplogic.com`.
3. Click on **DNS** -> **Manage DNS**.
4. Look for an **A Record** with the Host `@`.
   - **If it's missing**: Click **Add** and create a new A record:
     - **Type**: A
     - **Name**: @
     - **Value**: [Your Server IP Address] (This is usually provided by your hosting provider)
     - **TTL**: 1 Hour

## 2. Check Nameservers
1. Scroll down to the **Nameservers** section.
2. Ensure they are pointing to your intended host.
   - If you are using GoDaddy default, they usually look like `ns07.domaincontrol.com`.
   - If you are using a 3rd party host (like Vercel or Netlify), you must update these to their nameservers.

## 3. Propagation Time
Once you save the changes, it can take anywhere from **15 minutes to 48 hours** for the domain to work globally (DNS Propagation).

## 4. Verification
You can use [DNSChecker.org](https://dnschecker.org/#A/nextsteplogic.com) to see if the record is updating.

> [!NOTE]
> If you are unsure what your **IP Address** is, check your hosting dashboard (e.g., DigitalOcean, Vercel, AWS).
走
