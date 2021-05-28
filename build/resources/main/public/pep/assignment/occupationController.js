import {ObservableList}                     from "../../observable/observable.js";
import {QualifiedAttribute, VALUE, valueOf} from "../../presentationModel/presentationModel.js";

import {Assignment}                         from "./assignmentModel.js";

export {OccupationController}

let id = 0; // local singleton state to generate unique ids for view purposes

const OccupationController = projController => {

    const innerList      = []; // local state, never exposed
    const occupations = ObservableList(innerList);

    /**
     * @param {Assignment} assignmentData
     * @return {number} the id that has been used to create the assignment
     * */
    const addAssignment = (assignmentData, broadcast) => {

        if (assignmentData.amount <= 0) { return; } // guard (do not resurrect deleted assignments)

        const occupation = Assignment();
        if (null != assignmentData.id ) {
            id = Math.max(Number(assignmentData.id), id) // make sure we use a higher number than ever seen
        }
        const occupationId = id;
        assignmentData.id = id;
        id++;

        occupation.id.getObs(VALUE).setValue(occupationId);
        updateValues(occupation, assignmentData);

        occupation.id       .setQualifier(`Assignment.${occupationId}.id`);
        occupation.weekId   .setQualifier(`Assignment.${occupationId}.weekId`);
        occupation.devId    .setQualifier(`Assignment.${occupationId}.devId`);
        occupation.projId   .setQualifier(`Assignment.${occupationId}.projId`);
        occupation.amountPct.setQualifier(`Assignment.${occupationId}.amountPct`);

        occupation.projectName  = QualifiedAttribute(`Assignment.${occupationId}.projectName`);
        occupation.projectColor = QualifiedAttribute(`Assignment.${occupationId}.projectColor`);

        occupation.projId.getObs(VALUE).onChange(projId => {
            const project = projController.findById(projId);
            occupation.projectName.getObs(VALUE).setValue(valueOf(project.name));
            occupation.projectColor.getObs(VALUE).setValue(valueOf(project.color));
        });

        occupations.add(occupation);

        // notify the world that we have a new assignment
        broadcast(assignmentData);

        const modelToJson = model => ({
            id:      valueOf(model.id),
            version: valueOf(model.version),
            week:    valueOf(model.weekId),
            devId:   valueOf(model.devId),
            projId:  valueOf(model.projId),
            amount:  valueOf(model.amountPct)
        });
        const tellTheWorld = value => {
            occupation.version.getObs(VALUE).setValue(valueOf(occupation.version) + 1);
            broadcast(modelToJson(occupation));
        };

        occupation.weekId.getObs(VALUE)     .onChange(tellTheWorld); // selection of properties that's value changes the world needs to know about.
        occupation.devId.getObs(VALUE)      .onChange(tellTheWorld);
        occupation.projId.getObs(VALUE)     .onChange(tellTheWorld);

        // setting value to 0 removes the assignment and notifies remove-listener
        // make sure we do this before telling everybody
        occupation.amountPct.getObs(VALUE).onChange( newAmount => {
            if (0 === newAmount) {
                occupations.del(occupation);
            }
            tellTheWorld(newAmount);
        });

        return occupationId;
    };

    /**
     * @param {*} occupationPm, the presentation model for the occupation
     * @param {Assignment} assignmentData
     */
    const updateValues = (occupationPm, assignmentData) => {
        occupationPm.version  .getObs(VALUE).setValue(assignmentData.version || 0);
        occupationPm.weekId   .getObs(VALUE).setValue(assignmentData.week);
        occupationPm.devId    .getObs(VALUE).setValue(assignmentData.devId);
        occupationPm.projId   .getObs(VALUE).setValue(assignmentData.projId);
        occupationPm.amountPct.getObs(VALUE).setValue(assignmentData.amount);
    };

    const findById = assignmentId =>
        innerList.find( assignment => assignment.id.getObs(VALUE).getValue() === assignmentId);

    const findAllByDevIdAndWeekId = (devId, weekId) =>
        innerList.filter( assignment =>
                assignment.devId .getObs(VALUE).getValue() === devId
             && assignment.weekId.getObs(VALUE).getValue() === weekId);

    return {
        addAssignment,
        removeAssignment:     occupations.del,
        onAssignmentAdded:    occupations.onAdd,
        onAssignmentRemoved:  occupations.onDel,
        findAllByDevIdAndWeekId,
        findById,
        updateValues
    }
};
