<!DOCTYPE html>
<html>
<head>
    <asset:javascript src="spring-websocket"/>
    <title>WS Example</title>
</head>

<body>

<p> Example page to show the client-side use of Web Sockets from JavaScript.</p>
<p> Depends on spring-websocket for the sake of sending text over the binary protocol more easily.</p>

<button id="helloButton">hello</button>

<div id="out"></div>


<script>

    const URL = "${createLink(uri: '/stomp')}"; // let gsp put in the current server (relatively) on js creation time
    const channel = "/topic/hello";
    const endpoint = "/app/hello";

    const socket = new SockJS(URL);
    const client = webstomp.over(socket);

    client.connect({},  () => {
        client.subscribe(channel, message =>  {
            document.querySelector("#out").innerText = "received: " + message.body + " ";
        });
    });

    document.querySelector("#helloButton").onclick = evt => client.send(endpoint, JSON.stringify("world"));

</script>
</body>
</html>
