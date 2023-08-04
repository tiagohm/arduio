import five, { ButtonOption } from 'johnny-five'
import { DeviceHandler } from './device.handler.js'

export class ButtonHandler extends DeviceHandler<number, five.Button> {

    supports(topic: string) {
        return topic.match(/button\/(\d{1,2})\/(attach)/) || false
    }

    handle(board: five.Board, matcher: RegExpMatchArray, message: any) {
        const pin = parseInt(matcher[1])
        const command = matcher[2]

        console.info('Button. pin=%d, command=%s, message=%s', pin, command, message)

        const device = this.get(pin)

        switch (command) {
            case 'attach':
                if (!device) {
                    const options: ButtonOption = { ...message, pin, board }
                    const device = new five.Button(options)
                    device.on('up', () => this.sendMessage('up', pin, device.upValue))
                    device.on('down', () => this.sendMessage('down', pin, device.downValue))
                    device.on('hold', () => this.sendMessage('hold', pin, 0))
                    this.set(pin, device)
                }
                break
        }
    }

    private sendMessage(type: string, pin: number, value: number) {
        this.publish(`BUTTON/${pin}/${type}`, { value })
    }
}
