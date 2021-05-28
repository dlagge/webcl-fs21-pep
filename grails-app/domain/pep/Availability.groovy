package pep

class Availability {

    Developer developer
    Week      week
    int       fte_pct // 100% is one Full-Time-Equivalent

    String toString() { "Dev $developer is in week $week $fte_pct% available" }

    static constraints = {
    }
}
