/*
    Modelo de datos

    API:
    * Crear amigo
    * Devolver lista amigos

 */

class Friends {
    constructor() {
        this.friends = this.loadAll()
        this.wereChangesEvent = new Event()
    }

    newFriend(data) {
        this.friends.push(new Friend(data.name, data.date, data.importance, data.periodicity, data.note))
        this.saveAll()

        this.wereChangesEvent.trigger(this.getAll())
    }

//----------------------------------------------------------------------------------

    editFriend(data) {

        const {name, date, importance, periodicity, note} = data


        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {

                this.friends[i].date = date
                this.friends[i].importance = parseInt(importance)
                this.friends[i].periodicity = parseInt(periodicity)
                this.friends[i].note = note

                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

//----------------------------------------------------------------------------------
    deleteFriend(name) {

        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {

                this.friends.splice(i, 1)
                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

//-------------------------------------------------------------------------------------

    deleteHistoryEntry(params) {

        const [name, date] = params

        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {

                const fh = this.friends[i].history.history

                for (let j = 0; j < fh.length; j++) {
                    if (date === fh[j].date) {

                        fh.splice(j, 1)
                        this.saveAll()
                        return
                    }
                }
            }
        }
    }

//-------------------------------------------------------------------------------------
    confirmDate(params) {

        function addDays(date, days) {
            let result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        const {name, date, note} = params
        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {
                this.friends[i].history.add(date, note, true)
                const intermediateProcessingDate = addDays(date, this.friends[i].periodicity)
                this.friends[i].date = intermediateProcessingDate.toISOString().substring(0, 10)
                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

//-------------------------------------------------------------------------------------
    loadAll() {

        const hola = JSON.parse(localStorage.getItem("friends")) || []
        const friends = []

        for (const h of hola) {
            const {name, date, importance, periodicity, note, history} = h
            const friend = new Friend(name, date, importance, periodicity, note)
            for (const hist of history.history) {
                const {date, note, state} = hist
                friend.history.add(date, note, state)
            }
            friends.push(friend)
        }
        return friends;
    }

    saveAll() {
        localStorage.setItem("friends", JSON.stringify(this.friends))
    }

    getAll() {
        return this.friends
    }
}

// ---------------------------------------------------------------------------------

class Friend {
    constructor(name, date, importance, periodicity, note) {
        this.name = name
        this.date = (new Date(date)).toISOString().substring(0, 10)
        this.importance = parseInt(importance)
        this.periodicity = parseInt(periodicity)
        this.note = note
        this.history = new History()
    }
}

// ---------------------------------------------------------------------------------

class History {
    constructor() {
        this.history = []
    }

    add = function (date, note, state) {
        this.history.push(new HistoryNote(date, note, state))
    }
    delete = function (date) {
        for (const [i, histNote] of this.history) {
            if (histNote.date === date) {
                this.history.splice(i, 1)
                break
            }
        }
    }
}

// --------------------------------------------------------------------------------

class HistoryNote {
    constructor(date, note, state) {
        this.date = date
        this.note = note
        this.state = state
    }
}