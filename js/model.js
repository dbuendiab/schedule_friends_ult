"use strict"

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
                this.friends[i].date = addDays(date, this.friends[i].periodicity).toISOString().substring(0, 10)
                this.friends[i].note = ""

                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

//-------------------------------------------------------------------------------------

    loadAll() {
        // return JSON.parse(localStorage.getItem("friends")) || []
        const friendsAttributes = JSON.parse(localStorage.getItem("friends")) || []
        const friendsArr = []
        for (const friendData of friendsAttributes) {
            const {name, date, importance, periodicity, note, history} = friendData
            const friend = new Friend(name, date, importance, periodicity, note)

            for (const histNoteData of history.history) {
                const {date, note, state} = histNoteData
                friend.history.add(date, note, state)
            }

            friendsArr.push(friend)
        }
        return friendsArr
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
        this.date = date
        this.importance = parseInt(importance)
        this.periodicity =  parseInt(periodicity)
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