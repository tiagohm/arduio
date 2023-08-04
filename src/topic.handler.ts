
import five from 'johnny-five'
import { TopicPublisher } from './topic.publisher.js'

export interface TopicHandler {

    supports(topic: string): RegExpMatchArray | false

    handle(board: five.Board, matcher: RegExpMatchArray, message?: any): void

    register(publisher: TopicPublisher): boolean

    dispose(): void
}
