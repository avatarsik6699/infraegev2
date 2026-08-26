# DNS and TLS

- Registrar/DNS: REG.RU, authoritative nameservers `ns1.reg.ru` and `ns2.reg.ru`. Canonical origin:
  `https://infraege.ru`; `www` redirects to the apex.
- Required records: `A @ 2.26.8.245` and `A www 2.26.8.245`. Replace the previous
  `95.163.244.138` values; do not leave duplicate A records. There is no IPv6 record until the VPS
  is deliberately configured for IPv6.
- Check propagation with `dig +short A infraege.ru` and `dig +short A www.infraege.ru` from two
  independent resolvers before requesting a certificate.
- The first certificate uses Certbot standalone mode, so ports 80/443 must be free. Subsequent
  renewal uses webroot `/var/www/certbot`; the deploy hook reloads only the Nginx container.
- Certificate contact: `avatarsik6699@gmail.com`. This address is for expiry/account notices, not a
  certificate private key or a GitHub secret.

Verification:

```bash
curl -I http://infraege.ru
curl -I https://www.infraege.ru
curl -fsS https://infraege.ru/health/ready | jq .
echo | openssl s_client -servername infraege.ru -connect infraege.ru:443 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates
sudo certbot renew --dry-run --no-random-sleep-on-renew
```

The scheduled GitHub probe fails when HTTPS/readiness fails or fewer than 14 certificate days
remain. It deliberately has no Telegram integration yet; inspect Actions and sre-kit.
