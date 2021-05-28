import {dom} from "../util/dom.js"
import {registerForMouseDrag} from "./mouseDrag.js";

import {PepController} from "./pepController.js";

import {WeekController} from "./week/weekController.js";
import {weekProjector} from "./week/weekProjector.js";

import {AvailabilityController} from "./availability/availabilityController.js";
import {availabilityProjector} from "./availability/availabilityProjector.js";

import {OccupationController} from "./assignment/occupationController.js";
import {occupationProjector} from "./assignment/occupationProjector.js";

import {StaffingController} from "./assignment/staffingController.js";
import {staffingProjector} from "./assignment/staffingProjector.js";

import {DeveloperController} from "./developer/devController.js"
import {developerProjector} from "./developer/devProjector.js";

import {ProjectController} from "./project/projectController.js"
import {projectProjector} from "./project/projectProjector.js"

import {NeedController} from "./need/needController.js";
import {needProjector} from "./need/needProjector.js";
import {VALUE, valueOf} from "../presentationModel/presentationModel.js";

export { start } ;

const start = (services, appRootId, devArray) => {

    const pepController = PepController();

    const weekController = WeekController(); // static structural information is set up eagerly
    pepController.weeks.forEach( weekData => weekController.addWeek(weekData) );

    const developerController       = DeveloperController();
    const projectController         = ProjectController();

    const availabilityController    = AvailabilityController();
    const occupationController      = OccupationController(projectController);

    const needController            = NeedController();
    const staffingController        = StaffingController(developerController);

    const newAssignmentCommand = assignment => {
        occupationController.addAssignment(assignment, services.broadcast); // we add both but qualifiers keep them in sync
        staffingController.addAssignment(assignment);
    };

    services.setAssignmentHandler(assignment => {
        console.log("setting raw assignment", assignment);
        const candidate = occupationController.findById(assignment.id);
        if (candidate) { // update values
            if(assignment.version <= valueOf(candidate.version)) { return; } // ignore obsolete updates
            occupationController.updateValues(candidate, assignment);
        } else {
            console.log("no assignment with id", assignment.id, "creating new");
            newAssignmentCommand(assignment);
        }
    });

    const render = () => {

        // todo: think about resetting the model world on a possible re-render

        const root = dom(`<div id="${appRootId}">`);

        // render header of week names and setting up the "columns"s
        weekProjector(weekController, root);

        // register add/remove listeners for the various presentation model types in the developer topic
        developerProjector(developerController, weekController, occupationController, root);
        availabilityProjector(availabilityController, root);
        occupationProjector(occupationController, root);

        projectProjector(projectController, weekController, staffingController, newAssignmentCommand, root);
        needProjector(needController, root);
        staffingProjector(staffingController, root);

        // adding the initial data. dev needs to come first to provide the view hooks
        devArray.forEach( developer             => developerController.addDeveloper(developer) );
        pepController.avails.forEach( avail     => availabilityController.addAvailability(avail) );

        pepController.projects.forEach( project => projectController.addProject(project) );
        pepController.FTEs.forEach( need        => needController.addNeed(need));

        pepController.assignments.forEach( newAssignmentCommand );

        const topicsOverWeeks = document.getElementById(appRootId);
        topicsOverWeeks.replaceWith(root);
    };

    const tunix = () => undefined;
    registerForMouseDrag( tunix );

    render();
};
