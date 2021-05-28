package pep

import grails.rest.Resource

@Resource(uri='/developers', formats=['json'])
class Developer {

    String firstName
    String lastName
    String imageUrl

    String toString() { "$firstName $lastName" }

    static constraints = {
        firstName nullable: true
        lastName  nullable: true
        imageUrl  nullable: true
    }
}
