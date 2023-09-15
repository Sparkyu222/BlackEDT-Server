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
    content: []
}

// Arborescence de boutons
var directory2 = [
    {
        name: "Calendrier",
        type: "folder",
        content: [
            {
                name: "RT1",
                type: "folder",
                content: [
                    {
                        name: "TD1",
                        type: "folder",
                        content: [
                            {
                                name: "TP1",
                                type: "file",
                                uid: 4096
                            },
                            {
                                name: "TP2",
                                type: "file",
                                uid: 4095
                            }
                        ]
                    },
                    {
                        name: "TD2",
                        type: "folder",
                        content: [
                            {
                                name: "TP3",
                                type: "file",
                                uid: 4097
                            },
                            {
                                name: "TP4",
                                type: "file",
                                uid: 4099
                            }
                        ]
                    }
                ]
            },
            {
                name: "RT2",
                type: "folder",
                content: [
                    {
                        name: "TD1",
                        type: "folder",
                        content: [
                            {
                                name: "TP1",
                                type: "file",
                                uid: 4093
                            },
                            {
                                name: "TP2",
                                type: "file",
                                uid: 4032
                            }
                        ]
                    },
                    {
                        name: "TD2",
                        type: "folder",
                        content: [
                            {
                                name: "TP3",
                                type: "file",
                                uid: 40432
                            },
                            {
                                name: "TP4",
                                type: "file",
                                uid: 4012
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Notes",
        type: "folder",
        content: [
            {
                name: "RT1",
                type: "folder",
                content: [
                    {
                        name: "R101",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R102",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R103",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R103",
                        type: "file",
                        ressource: 2345
                    },{
                        name: "R105",
                        type: "file",
                        ressource: 2345
                    },{
                        name: "R106",
                        type: "file",
                        ressource: 2345
                    },{
                        name: "R107",
                        type: "file",
                        ressource: 2345
                    },{
                        name: "R108",
                        type: "file",
                        ressource: 2345
                    },{
                        name: "R109",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R110",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R111",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R112",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R113",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R114",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "R115",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "SAE101",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "SAE102",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "SAE103",
                        type: "file",
                        ressource: 2345
                    },
                    {
                        name: "SAE104",
                        type: "file",
                        ressource: 2345
                    }
                ]
            },
            {
                name: "RT2",
                type: "folder",
                content: [
                    {
                        name: "R103",
                        type: "folder",
                        content: []
                    },
                    {
                        name: "SAE104",
                        type: "folder",
                        content: []
                    }
                ]
            }
        ]
    },
    {
        name: "Salles",
        type: "folder",
        content: []
    }
]