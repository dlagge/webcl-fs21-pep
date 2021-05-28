package pep

class Week {

    int     year
    int     calendarWeek
    Date    beginDate
    Date    endDate

    String toString() { "$calendarWeek - $year" }

    static constraints = {
        year         inList: (2019..2025).toList()
        calendarWeek inList: (1..52).toList()
        beginDate    ()
        endDate      ()
    }
}
