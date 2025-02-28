from serial import Serial
import json
import time

import serial 


# configure the serial port
ser = serial.Serial('COM3', 9600)


# open the output file
filename = "htdata.json"
f = open(filename, "w")

# read data from the serial port and write it to the output file
while True:
    if ser.in_waiting > 0:
        data = ser.readline().decode().strip()
        json_data = json.loads(data)
        f.write(json.dumps(json_data))
        f.write('\n')
    time.sleep(0.1)

# close the serial port and output file
ser.close()
f.close()