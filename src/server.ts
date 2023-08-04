import EventEmitter from 'events'
import five from 'johnny-five'
import mqtt from 'mqtt'
import { TopicHandler } from './topic.handler.js'

export class MqttBoardServer extends EventEmitter {

    private handlers: TopicHandler[] = []
    private readonly board: five.Board
    private client?: mqtt.MqttClient

    constructor(
        host: string,
        port: number = 8883,
        username?: string,
        password?: string,
    ) {
        super()

        const board = new five.Board({
            repl: false
        })

        board.on('ready', () => {
            const client = mqtt.connect({ host, port, username, password, protocol: 'mqtts' })

            client.on('connect', () => {
                this.emit('connected')

                client.subscribe('#')

                const publisher = (topic: string, message: any) => {
                    client.publishAsync(topic, JSON.stringify(message))
                }

                for (const handler of this.handlers) {
                    handler.register(publisher)
                }

                client.on('message', (topic, buffer) => {
                    let count = 0

                    for (const handler of this.handlers) {
                        const m = handler.supports(topic)

                        if (m !== false) {
                            try {
                                const message = JSON.parse(buffer.toString() || '{}')
                                handler.handle(board, m, message)
                            } catch (e) {
                                publisher('error', e)
                                console.error(e)
                            } finally {
                                count++
                            }
                        }
                    }

                    if (count === 0) {
                        console.warn('Unhandled topic: %s', topic)
                    }
                })

                client.on('close', () => {
                    this.emit('closed')
                    this.dispose()
                })

                client.on('error', (e) => {
                    this.emit('error', e)
                })
            })

            this.client = client
        })

        board.on('error', (e) => {
            this.emit('error', e)
        })

        board.on('close', () => {
            this.emit('closed')
            this.dispose()
        })

        this.board = board
    }

    register(handler: TopicHandler) {
        this.handlers.push(handler)
    }

    private dispose() {
        for (const handler of this.handlers) {
            handler.dispose()
        }
    }
}
