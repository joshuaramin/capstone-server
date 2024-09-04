import { objectType } from "nexus";


export const ReportObject = objectType({
    name: "report",
    definition(t) {
        t.id("reportID");
        t.string("message");
    
    },
})