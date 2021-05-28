package pep

import grails.converters.JSON

class ExampleController {

    def index() { }
    def dev()   { }

    def weekData(int fromWeekNr, int toWeekNr) {

        List<Week> weeks = Week.findAllByCalendarWeekInRange(fromWeekNr .. toWeekNr)

        List<Assignment> assignments = Assignment.findAllByWeekInList(weeks)

        List<Availability> avails = Availability.findAllByWeekInList(weeks)

        List<Need> needs = Need.findAllByWeekInList(weeks)

        // devs that have an assignment this week or have an availability entry
        List<Developer> devs = (assignments*.developer + avails*.developer).unique(false)

        // projects that have an assignment this week or have a need entry
        List<Project> projects = (assignments*.project + needs*.project).unique(false)

        def result = [
            weeks:          weeks,
            assignments:    assignments,
            availabilities: avails,
            needs :         needs,
            developers:     devs,
            projects:       projects,
        ]

        render result as JSON
    }

}
