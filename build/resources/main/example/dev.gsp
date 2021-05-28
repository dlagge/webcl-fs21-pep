<!DOCTYPE html>
<html>
<head>
  <script src="/static/restExampleStarter.js" type="module"></script>
  <title>REST Example</title>
</head>

<body>
<p> Example on how to use REST on the client side through JavaScript
    by dynamically relaying information about the server endpoint.
</p>

<p> The JS module system is in use. So we need an extra async starter to make it work in FF.</p>
<p> Errors will be logged when trying to delete dev 2, which has a foreign key relation.</p>

<pre>

%{-- Relay information to the module by putting it in the window namespace --}%
<div id="root"></div>

<script>
  // this could be determined in JS as well but it serves as an example on how to relay information to the view
  window.grailsServerName = "${request.serverName}"; // note that this is GSP escaped!
  window.grailsServerPort = "${request.serverPort}";
  window.restPath         = '/developers';
  window.appRoot          = root;                    // keep page specifics in the page
</script>

</pre>
</body>
</html>
