package pep

class Need {

    Project   project
    Week      week
    int       fte_pct // 100% is one Full-Time-Equivalent

    String toString() { "Project $project needs $fte_pct% FTEs in week $week." }

    static constraints = {
    }
}
