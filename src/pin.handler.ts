import five from 'johnny-five'
import { DeviceHandler } from './device.handler.js'

export class PinHandler extends DeviceHandler<number, five.Pin> {

    supports(topic: string) {
        return topic.match(/pin\/(\d{1,2})\/(low|high|attach)/) || false
    }

    handle(board: five.Board, matcher: RegExpMatchArray, message: any) {
        const pin = parseInt(matcher[1])
        const command = matcher[2]

        console.info('Pin. pin=%d, command=%s, message=%s', pin, command, message)

        const device = this.get(pin)

        switch (command) {
            case 'low':
                device?.write(1)
                break
            case 'high':
                device?.write(0)
                break
            case 'attach':
                if (!device) {
                    const device = new five.Pin({ pin, board })
                    device.on('data', () => this.sendMessage(pin, device.value))
                    this.set(pin, device)
                }
                break
        }
    }

    private sendMessage(pin: number, value: number) {
        this.publish(`pin/${pin}/value`, { value })
    }
}
