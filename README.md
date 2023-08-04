# Arduio

MQTT agent for manager your Firmata Protocol based Arduino boards.

## Topics

### LED

Represents a single LED attached to the physical board.

* `led/[pin]/attach`: Attach the LED.
* `led/[pin]/on`: Turn the LED on.
* `led/[pin]/off`: Turn the LED off.
* `led/[pin]/toggle`: Toggle the current state.
* `led/[pin]/strobe`: Strobe the LED on/off in phases over `ms`.
* `led/[pin]/stop`: Stop LED strobe operation.

### Pin

Represents any one pin on the physical board.

* `pin/[pin]/attach`: Attach the pin and listen to events `button/[pin]/up`, `button/[pin]/down`, `button/[pin]/hold`.
* `pin/[pin]/low`: Set the pin `LOW`.
* `pin/[pin]/high`: Set the pin `HIGH`.
