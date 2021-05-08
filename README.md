# Proxy server for backend services

Node server will act as proxy server for other backend services

## Instrction to install cert and run proxy server

1. Install `mkcert`, there are instructions for macOS/Windows/Linux (https://github.com/FiloSottile/mkcert).

2. `mkcert -install` to create a local CA.

3. `mkcert *.sellerspot.in *.dev.sellerspot.in *.dev1.sellerspot.in localhost 127.0.0.1 ::1` to create a trusted cert for the mentioned domains in the current directory.

4. The above command will generate \_wildcard.sellerspot.in+4-key.pem and \_wildcard.sellerspot.in+4.pem files under security folder. (watch the file names)

5. If You're using node (which doesn't use the system root store), so you need to specify the CA explicitly in an environment variable (especially in linux), with following command.
   > `export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem`".
6. Run the server with `npm run dev`.

## Following domains needs to be mapped in local hosts file

```ts
127.0.0.1 sellerspot.in
127.0.0.1 api.sellerspot.in
127.0.0.1 accounts.sellerspot.in
127.0.0.1 dev.sellerspot.in
127.0.0.1 app.dev.sellerspot.in
127.0.0.1 dev1.sellerspot.in
127.0.0.1 app.dev1.sellerspot.in
```
