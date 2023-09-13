// Template d'évênement
var eventTemplate = {
    subject: '',
    location: '',
    start_time: '',
    duration: '',
    teacher: [],
    groups: [],
    exam: null
}

// Objet de réponse
var objReponse = {
    type: "string",
    error: false,
    content: {}
}

// Arborescence de boutons
var directory2 = {
    calendar: {
        name: "Calendrier",
        type: "folder",
        content: {

                item1: {
                    name: "RT1",
                    type: "folder",
                    content: {},
                },
                item2: {
                    name: "RT2",
                    type: "folder",
                    content: {
                        folder21: {
                            name: "RT2",
                            type: "folder",
                            content: {
                                file1: {
                                    name: "TP1",
                                    type: "calendar",
                                    uid: 4096
                                },
                                file2: {
                                    name: "notes",
                                    type: "pdf",
                                    uid
                                }
                            }
                        }
                    }
                }

        }

    },
    grades: {
        name: "Calendrier",
        type: "folder",
        content: {}
    }
}