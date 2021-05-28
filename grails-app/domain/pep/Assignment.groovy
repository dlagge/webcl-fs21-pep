package pep

class Assignment {

    Developer developer
    Project   project
    Week      week
    int       fte_pct // 100% is one Full-Time-Equivalent

    String toString() { "Assign $developer to $project in week $week $fte_pct%" }

    static constraints = {
    }
}
