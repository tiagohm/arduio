import five from 'johnny-five'
import { DeviceHandler } from './device.handler.js'

export class LedHandler extends DeviceHandler<number, five.Led> {

    supports(topic: string) {
        return topic.match(/led\/(\d{1,2})\/(on|off|stop|toggle|strobe|attach)/) || false
    }

    handle(board: five.Board, matcher: RegExpMatchArray, message: any) {
        const pin = parseInt(matcher[1])
        const command = matcher[2]

        console.info('LED. pin=%d, command=%s, message=%s', pin, command, message)

        const device = this.get(pin)

        switch (command) {
            case 'on':
                device?.on()
                break
            case 'off':
                device?.off()
                break
            case 'toggle':
                device?.toggle()
                break
            case 'stop':
                device?.stop()
                break
            case 'strobe':
                device?.strobe(message.ms || 500)
                break
            case 'attach':
                if (!device) {
                    const device = new five.Led({ pin, board })
                    this.set(pin, device)
                }
                break
        }
    }
}
