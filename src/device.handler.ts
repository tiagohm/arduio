import { Board } from 'johnny-five'
import { TopicHandler } from './topic.handler.js'
import { TopicPublisher } from './topic.publisher.js'

export abstract class DeviceHandler<K, V> extends Map<K, V> implements TopicHandler {

    private readonly publishers: TopicPublisher[] = []

    abstract supports(topic: string): false | RegExpMatchArray

    abstract handle(board: Board, matcher: RegExpMatchArray, message: any): void

    dispose() { }

    register(publisher: TopicPublisher): boolean {
        this.publishers.push(publisher)
        return true
    }

    protected publish(topic: string, message?: any) {
        for (const publisher of this.publishers) {
            publisher(topic, message)
        }
    }
}
