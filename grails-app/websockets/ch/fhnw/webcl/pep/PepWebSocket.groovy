package ch.fhnw.webcl.pep

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo

class PepWebSocket {

    @MessageMapping("/broadcast")
    @SendTo("/queue/broadcast")
    String broadcast(String command) {
        println "broadcasting command: $command"
        return command
    }

}
