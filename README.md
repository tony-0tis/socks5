# socks5-server
To configure server settings add config.json with content:
```
{
  port: Number, - Port of socks5 server (default 1080)
  debug: Boolean, - Display each request info (default true)
  auth: null || {login: String, password: String} || [{login: String, password: String}] - Auth parameters (Default null)
}
```
