# Standard Login Form

A configurable authentication login for any Web Application

## How this works?

Lock for the the next section in the `login.html` file and replace the values acording with your backend configuration.

```html
<script type="text/javascript" id="app_init">
  /**
   * Set your config here!
   */
  __APP_SHELL = {
    loginServiceUrl: '../api/usuarios',
    loginRedirectUrl: 'index.html',
    usrParam: 'usuario',
    pwdParam: 'clave',
  };
</script>
```

Enjoy it!
