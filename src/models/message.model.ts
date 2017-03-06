export class Message {
    constructor(
        public id: number,
        public date: Date,
        public message: string,
        public sender: number,
        public receiver: number,
        public event: number
    ){}
}