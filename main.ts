import dotenv from 'dotenv'
import { LedHandler } from './src/led.handler.js'
import { MqttBoardServer } from './src/server.js'

dotenv.config()

const server = new MqttBoardServer(
    process.env.MQTT_HOST!,
    parseInt(process.env.MQTT_PORT!),
    process.env.MQTT_USERNAME!,
    process.env.MQTT_PASSWORD!,
)

server.on('connected', () => {
    console.info('MQTT Board Server connected')
})

server.on('closed', (e) => {
    console.error('MQTT Board Server error', e)
})

server.on('error', (e) => {
    console.error('MQTT Board Server error', e)
})

server.register(new LedHandler())
