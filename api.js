const express = require('express');
const app = express();

const calendar = {
    class: {
        RT1: {
            TD1: 'RT1 TD1',
            TD2: 'RT1 TD2'
        },
        RT2: {
            TD1: 'RT2 TD1',
            TD2: 'RT2 TD2'
        }
    },
    room: {
        'PROJ-DOC': 'PROJ-DOC',
        'RT-ELEC-TEL': 'RT-ELEC-TEL'
    }
};

app.get('/calendar/:one/:two/:three', (req, res) => {
    const { one, two, three } = req.params;
    res.send(calendar[one][two][three]);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});