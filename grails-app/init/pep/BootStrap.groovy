package pep

import java.time.LocalDate

class BootStrap {

    def init = { servletContext ->

        Developer dierk  = save Developer.findOrCreateWhere(firstName: "Dierk",  lastName: "König", imageUrl: "img2.jpg")
        Developer dieter = save Developer.findOrCreateWhere(firstName: "Dieter", lastName: "Holz",  imageUrl: "img3.jpg")

        Project webcl = save Project.findOrCreateWhere(name: "Web Clients")
        Project uieng = save Project.findOrCreateWhere(name: "UI Engineering")

        LocalDate weekBegin = LocalDate.of(2018,12,31)

        (1..52).each { weekNr ->
            Week week = save Week.findOrCreateWhere(
                year:           2019,
                calendarWeek:   weekNr,
                beginDate:      toDate(weekBegin),
                endDate:        toDate(weekBegin.plusDays(6)))
            weekBegin = weekBegin.plusDays(7)

            save Need.findOrCreateWhere(project: webcl, week: week , fte_pct:  50)
            save Need.findOrCreateWhere(project: uieng, week: week , fte_pct: 150)

            save Availability.findOrCreateWhere(developer: dierk  , week: week , fte_pct: 80)
            save Availability.findOrCreateWhere(developer: dieter , week: week , fte_pct: 100)

            save Assignment.findOrCreateWhere(developer: dieter , project: uieng, week: week , fte_pct: 100)
        }


    }

    private static Date toDate (LocalDate localDate) {
        return java.sql.Date.valueOf(localDate); // trick of the day
    }

    private static <Domain> Domain save(Domain domain) {
        domain.save(failOnError: true)
    }

    def destroy = {
    }
}
