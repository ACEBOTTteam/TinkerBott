/*
Shenzhen ACEBOTT Tech
modified from liusen
load dependency
"TinkerBott": "file:../pxt-TinkerBott"
*/

//% color="#ECA40D" weight=20 icon="\uf085"
namespace TinkerBott {

    // Microbit controller  @start

    export enum Rocker {
        //% block="X" enumval=0
        x,
        //% block="Y" enumval=1
        y,
        //% block="Key" enumval=2
        key,
    }


    //% blockId=joystick block="Read joystick value %dir "
    //% group="Microbit controller"
    //% subcategory="Executive"
    export function joystick(dir: Rocker): number | boolean {
        switch (dir) {
            case Rocker.x:
                return pins.analogReadPin(AnalogPin.P1); // 读取摇杆 X 值
            case Rocker.y:
                return pins.analogReadPin(AnalogPin.P2); // 读取摇杆 Y 值
            case Rocker.key:
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp); // 设置按键引脚为上拉模式
                return pins.digitalReadPin(DigitalPin.P8) === 0; // 读取按键状态，返回布尔值
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }

    export enum Four_key {
        //% block="Up" enumval=0
        up,
        //% block="Down" enumval=1
        down,
        //% block="Left" enumval=2
        left,
        //% block="Right" enumval=3
        right
    }

    //% blockId=Four_bit_key block="Read the %dir key"
    //% group="Microbit controller"
    //% subcategory="Executive"
    export function Four_bit_key(dir: Four_key): boolean {
        // 设置引脚的上拉电阻
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)

        // 根据方向读取对应的按键状态
        switch (dir) {
            case Four_key.up:
                return pins.digitalReadPin(DigitalPin.P16) === 0;
            case Four_key.down:
                return pins.digitalReadPin(DigitalPin.P14) === 0;
            case Four_key.left:
                return pins.digitalReadPin(DigitalPin.P13) === 0;
            case Four_key.right:
                return pins.digitalReadPin(DigitalPin.P15) === 0;
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }


    export enum Vibration_motor_condition {
        //% block="ON" enumval=0
        on,
        //% block="OFF" enumval=1
        off,
    }

    // 控制震动电机
    //% blockId=Vibrating_machine block="Vibrating machine %condition"
    //% group="Microbit controller"
    //% subcategory="Executive"
    export function Vibrating_machine(condition: Vibration_motor_condition): void {
        if (condition === Vibration_motor_condition.on) {
            pins.digitalWritePin(DigitalPin.P12, 1); // 打开震动电机
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0); // 关闭震动电机
        }
    }
        // Microbit controller  @end

    // Trace Sensor @start
    let L_PIN = 0;
    let M_PIN = 0;
    let R_PIN = 0;


    //% blockId=Trace_Sensor_getValue block="Trace Sensor get value %index"
    //% group="Trace Sensor"
    //% subcategory="Sensor"
    export function Trace_Sensor_getValue(index: Trace_Sensor_Index): number {
      switch (index) {
          case 0:
              return pins.analogReadPin(R_PIN)
          case 1:
              return pins.analogReadPin(M_PIN)
          case 2:
              return pins.analogReadPin(L_PIN)
          default:
              return -1
      }
    }

    //% blockId=Trace_Sensor_init block="Trace Sensor set pin at (R:%rpin, M:|%mpin|, L:|%lpin)"
    //% rpin.defl=AnalogReadPin.P0
    //% mpin.defl=AnalogReadPin.P1
    //% lpin.defl=AnalogReadPin.P2
    //% group="Trace Sensor"
    //% subcategory="Sensor"
    export function Trace_Sensor_init(rpin: AnalogReadPin, mpin: AnalogReadPin, lpin: AnalogReadPin): void {
      R_PIN = getAnalogPin(rpin)
      M_PIN = getAnalogPin(mpin)
      L_PIN = getAnalogPin(lpin)
    }
    // Trace Sensor @end


    // Speech Recognition @start

    let speech_cmd = 0;

    //% block="Speech Recognition getCMD is %cmd_in"
    //% blockId = Speech_Recognition_getCMD
    //% group="Speech Recognition"
    //% subcategory="Sensor"
    export function Speech_Recognition_getCMD(cmd_in: number): boolean {
        return cmd_in == speech_cmd;
    }
    

    //% blockId="Speech_Recognition_Init" 
    //% block="Speech Recognition Init TX at %asrTX"
    //% group="Speech Recognition"
    //% subcategory="Sensor"
    export function Speech_Recognition_Init(asrTX: UARTPin): void {
        serial.redirect(SerialPin.USB_TX, getUartPin(asrTX), BaudRate.BaudRate115200);
        basic.forever(function () {
            let list = serial.readBuffer(1).toArray(NumberFormat.UInt8BE);
            speech_cmd = list[0];
        })
    }
    // Speech Recognition @end

    export enum RGBLights {
        //% blockId="Right_RGB" block="Right"
         RGB_R = 1,
        //% blockId="Left_RGB" block="Left"
         RGB_L = 2,
        //% blockId="ALL" block="ALL"
         ALL = 3
    }

    //% blockId=colorLight block="Set LED %light color $color"
    //% color.shadow="colorNumberPicker"
    //% weight=65
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function colorLight(light: RGBLights, color: number): void {
        let r: number, g: number, b: number;
        r = (color >> 16) & 0xFF; // 提取红色分量
        g = (color >> 8) & 0xFF;  // 提取绿色分量
        b = color & 0xFF;         // 提取蓝色分量
        singleheadlights(light, r, g, b); // 调用底层函数设置灯光颜色
    }

    
    //% inlineInputMode=inline
    //% blockId=singleheadlights block="Set %light lamp color R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=60
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function singleheadlights(light: RGBLights, r: number, g: number, b: number): void {
        let buf = pins.createBuffer(5);

        buf[0] = 0x00;
        buf[2] = r;
        buf[3] = g;
        buf[4] = b;

        if (light == 1) {
            buf[1] = 0x03;
            pins.i2cWriteBuffer(0x18, buf);
            basic.pause(10);
        }
        else if (light == 2) {
            buf[1] = 0x04;
            pins.i2cWriteBuffer(0x18, buf);
            basic.pause(10);
        }
        else if (light == 3) {
            buf[1] = 0x05;
            pins.i2cWriteBuffer(0x18, buf);
        }
    }
    
    // Microbit Car  @start

    export enum Direction {
        //% block="Forward" enumval=0
        forward,
        //% block="Backward" enumval=1
        backward,
        //% block="Left" enumval=2
        left,
        //% block="Right" enumval=3
        right
    }

    //% blockId=stopcar block="Stop"
    //% subcategory="Executive"
    //% group="Microbit Car"
    //% weight=70
    export function stopcar(): void {
        let buf = pins.createBuffer(5);
        buf[0] = 0x00;                      //补位
        buf[1] = 0x01;		                //左轮
        buf[2] = 0x00;
        buf[3] = 0;	                        //速度	
        pins.i2cWriteBuffer(0x18, buf);     //数据发送

        buf[1] = 0x02;		                //右轮停止
        pins.i2cWriteBuffer(0x18, buf);     //数据发送
    }

    //% blockId=motors block="Left wheel speed %lspeed\\% | right speed %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    //% weight=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function motors(lspeed: number = 0, rspeed: number = 0): void {
        let buf = pins.createBuffer(4);

        // 限制速度范围
        lspeed = Math.constrain(lspeed, -100, 100);
        rspeed = Math.constrain(rspeed, -100, 100);

        // 左轮控制
        if (lspeed === 0) {
            // 单独停止左轮
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x00;  // 停止
            buf[3] = 0;     // 速度为0
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (lspeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x02;  // 向前
            buf[3] = lspeed;
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // lspeed < 0
            buf[0] = 0x00;
            buf[1] = 0x01;  
            buf[2] = 0x01;  
            buf[3] = -lspeed;
            pins.i2cWriteBuffer(0x18, buf);
        }

        // 右轮控制
        if (rspeed === 0) {
            // 单独停止右轮
            buf[0] = 0x00;
            buf[1] = 0x02;  
            buf[2] = 0x00;  
            buf[3] = 0;     
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (rspeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x02;  
            buf[2] = 0x02;  
            buf[3] = rspeed
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // rspeed < 0
            buf[0] = 0x00;
            buf[1] = 0x02;  
            buf[2] = 0x01;  
            buf[3] = -rspeed; 
            pins.i2cWriteBuffer(0x18, buf);
        }
    }
    
    //% blockId=c block="Set direction %dir | speed %speed"
    //% weight=100
    //% speed.min=0 speed.max=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function moveTime(dir: Direction, speed: number = 50): void {

        let buf = pins.createBuffer(5);
        if (dir == 0) {                      
            buf[0] = 0x00;                  
            buf[1] = 0x01;
            buf[2] = 0x02;
            buf[3] = speed;	                 
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 1) {                  
            buf[0] = 0x00;                  
            buf[1] = 0x01;
            buf[2] = 0x01;
            buf[3] = speed;	               
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 2) {                    
            buf[0] = 0x00;                 
            buf[1] = 0x01;	
            buf[2] = 0x01;
            buf[3] = speed;	             
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            buf[2] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 3) {                   
            buf[0] = 0x00;                
            buf[1] = 0x01;	
            buf[2] = 0x02;
            buf[3] = speed;	                        
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            buf[2] = 0x01;
            pins.i2cWriteBuffer(0x18, buf);

        }

    }

    
    // Microbit Car  @start

    let _initEvents = true

    export enum MbPins {
        //% block="Left" 
        Left = DAL.MICROBIT_ID_IO_P1,
        //% block="Right" 
        Right = DAL.MICROBIT_ID_IO_P0
    }

    
    //% blockId=tracking block="%pin tracking value"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% weight=45
    //% subcategory="Executive"
    export function tracking(side: MbPins): number {
        pins.setPull(AnalogReadWritePin.P0, PinPullMode.PullUp); 
        pins.setPull(AnalogReadWritePin.P1, PinPullMode.PullUp);  
        let left_tracking = pins.analogReadPin(AnalogReadWritePin.P1); 
        let right_tracking = pins.analogReadPin(AnalogReadWritePin.P0); 

        if (side == MbPins.Left) {
            return left_tracking;
        }
        else if (side == MbPins.Right) {
            return right_tracking;
        }
        else {
            return 0;
        }
    }
    // Microbit Car  @end

    // Microbit K210  @start

    // 全局变量
    let set_mode = 0
    let x = 0      // X坐标
    let y = 0      // Y坐标
    let w = 0      // 宽度
    let h = 0      // 高度
    let cx = 0     // 中心点X坐标
    let cy = 0     // 中心点Y坐标
    let angle = 0  // 视觉巡线角度
    let tag = ""   // 识别内容
    let color_index = 0
    let red_value = 0
    let green_value = 0
    let blue_value = 0

    export enum RecognitionMode {
        //% block="qr code recogniton"
        QRCode = 2,
        //% block="barcode recognition"
        Barcode = 3,
        //% block="face recognition"
        Face = 4,
        //% block="image recognition"
        Image = 5,
        //% block="number recognition"
        Number = 6,
        //% block="traffic recognition: card"
        TrafficCard = 7,
        //% block="traffic recoqnition: sin plate"
        TrafficSign = 10,
        //% block="vision line followinga"
        VisualPatrol = 8,
        //% block="machine leaming"
        MachineLearning = 9
    }

    export enum ColorSelection {
        //% block="All"
        All = 0,
        //% block="Red"
        Red = 1,
        //% block="Green"
        Green = 2,
        //% block="Blue"
        Blue = 3
    }

    export enum CodeData {
        //% block="X coordinate"
        X,
        //% block="Y coordinate"
        Y,
        //% block="width"
        W,
        //% block="height"
        H,
        //% block="Center X"
        CenterX,
        //% block="Center Y"
        CenterY,
        //% block="recognition resul"
        Tag,
        //% block="tline following result"
        Angle
    }

    //% blockId=K210_Init block="Visual module initialize"
    //% subcategory="Executive"
    //% group="Microbit K210"
    //% weight=100
    export function K210_Init(): void {
        serial.setRxBufferSize(64);
        serial.redirect(
            SerialPin.P14,
            SerialPin.P15,
            BaudRate.BaudRate115200
        )
        set_mode = 0;
    }

    //% blockId=K210_Menu block="Visual module retum to main menu"
    //% subcategory="Executive"
    //% group="Microbit K210"
    //% weight=100
    export function K210_Menu(): void {
        if (set_mode != 0) {
            let data_send = pins.createBuffer(3)
            data_send.setNumber(NumberFormat.UInt8LE, 0, 0)
            data_send.setNumber(NumberFormat.UInt8LE, 1, 13)
            data_send.setNumber(NumberFormat.UInt8LE, 2, 10)
            serial.writeBuffer(data_send)
            basic.pause(100)
            set_mode = 0
        }
    }
    //% blockId=K210_RGB_lights block="Set Visual aRGB color R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=60
    //% subcategory="Executive"
    //% group="Microbit K210"
    export function K210_RGB_lights(r: number, g: number, b: number): void {
        if (red_value != r || green_value != g || blue_value != b) {
            let data_send = pins.createBuffer(7)
            data_send.setNumber(NumberFormat.UInt8LE, 0, set_mode)
            data_send.setNumber(NumberFormat.UInt8LE, 1, 255)
            data_send.setNumber(NumberFormat.UInt8LE, 2, r)
            data_send.setNumber(NumberFormat.UInt8LE, 3, g)
            data_send.setNumber(NumberFormat.UInt8LE, 4, b)
            data_send.setNumber(NumberFormat.UInt8LE, 5, 13)
            data_send.setNumber(NumberFormat.UInt8LE, 6, 10)
            serial.writeBuffer(data_send)
            basic.pause(100)
        }
        red_value = r
        green_value = g
        blue_value = b
    }

    //% blockId=recognize_color block="color recognition %color"
    //% subcategory="Executive"
    //% group="Microbit K210" 
    //% weight=95
    export function recognize_color(color: ColorSelection): boolean {
        // 模式切换检查（与Arduino完全一致）
        if (set_mode != 1 || color_index != color) {
            let data_send = pins.createBuffer(8);
            data_send.setNumber(NumberFormat.UInt8LE, 0, 1);       // set_mode
            data_send.setNumber(NumberFormat.UInt8LE, 1, color);   // color_index
            data_send.setNumber(NumberFormat.UInt8LE, 2, 600 >> 8); // area_threshold高字节
            data_send.setNumber(NumberFormat.UInt8LE, 3, 600 & 0xFF);// area_threshold低字节
            data_send.setNumber(NumberFormat.UInt8LE, 4, 100 >> 8); // pixels_threshold高字节
            data_send.setNumber(NumberFormat.UInt8LE, 5, 100 & 0xFF);// pixels_threshold低字节
            data_send.setNumber(NumberFormat.UInt8LE, 6, 13);      // CR
            data_send.setNumber(NumberFormat.UInt8LE, 7, 10);      // LF
            serial.writeBuffer(data_send);
            basic.pause(100);  // 与Arduino的delay(100)对应
            set_mode = 1;
            color_index = color;
        }

        // 数据接收与解析（关键修改点）
        let received = serial.readBuffer(0);
        if (received && received.length >= 12) {  // 最小有效长度=1(长度字节)+9(cx字段)+2(标签)
            let data_len = received.getNumber(NumberFormat.UInt8LE, 0);

            // 严格长度校验（与Arduino的while(available<data_len)等效）
            if (data_len < 9 || received.length < data_len + 1) {
                return false;
            }

            // 按Arduino协议手动解析（修复cx偏移量）
            x = (received.getNumber(NumberFormat.UInt8LE, 1) << 8) | received.getNumber(NumberFormat.UInt8LE, 2);
            y = received.getNumber(NumberFormat.UInt8LE, 3);
            w = (received.getNumber(NumberFormat.UInt8LE, 4) << 8) | received.getNumber(NumberFormat.UInt8LE, 5);
            h = received.getNumber(NumberFormat.UInt8LE, 6);
            cx = (received.getNumber(NumberFormat.UInt8LE, 7) << 8) | received.getNumber(NumberFormat.UInt8LE, 8); // 修正为第7-8字节
            cy = received.getNumber(NumberFormat.UInt8LE, 9);

            // 标签提取（与Arduino的String((char*)(UartBuff+9))等效）
            tag = "";
            for (let i = 10; i < data_len + 1; i++) {
                tag += String.fromCharCode(received.getNumber(NumberFormat.UInt8LE, i));
            }
            return true;
        }
        return false;
    }

    //% blockId=recognize_code block=" %mode"
    //% subcategory="Executive"
    //% group="Microbit K210"
    //% weight=90
    export function recognize_code(mode: RecognitionMode): boolean {

        // 检查是否需要切换模式
        if (set_mode != mode) {
            // 交通标志特殊处理
            if (mode == RecognitionMode.TrafficCard || mode == RecognitionMode.TrafficSign) {
                let data_send = pins.createBuffer(4)
                data_send.setNumber(NumberFormat.UInt8LE, 0, 7)  // 固定包头7
                // 卡片=1, 标识牌=2
                data_send.setNumber(NumberFormat.UInt8LE, 1, mode == RecognitionMode.TrafficCard ? 1 : 2)
                data_send.setNumber(NumberFormat.UInt8LE, 2, 13)
                data_send.setNumber(NumberFormat.UInt8LE, 3, 10)
                serial.writeBuffer(data_send)
                set_mode = mode  // 注意这里设置为实际模式值(7或10)
            }
            // 其他模式
            else {
                let data_send = pins.createBuffer(3)
                data_send.setNumber(NumberFormat.UInt8LE, 0, mode)
                data_send.setNumber(NumberFormat.UInt8LE, 1, 13)
                data_send.setNumber(NumberFormat.UInt8LE, 2, 10)
                serial.writeBuffer(data_send)
                set_mode = mode
            }
            basic.pause(100)
        }

        // 数据处理
        let available = serial.readBuffer(0)
        if (available && available.length > 0) {
            const currentTime = input.runningTime();
            const currentData = available.toHex();

            let data_len = available.getNumber(NumberFormat.UInt8LE, 0)

            if (available.length >= data_len + 1) {
                let payload = available.slice(2, data_len);
                x = (available.getNumber(NumberFormat.UInt8LE, 1) << 8) | available.getNumber(NumberFormat.UInt8LE, 2);
                y = available.getNumber(NumberFormat.UInt8LE, 3);
                w = (available.getNumber(NumberFormat.UInt8LE, 4) << 8) | available.getNumber(NumberFormat.UInt8LE, 5);
                h = available.getNumber(NumberFormat.UInt8LE, 6);
                if (mode == RecognitionMode.Face) {
                    cx = available.getNumber(NumberFormat.UInt16LE, 7)
                    cy = available.getNumber(NumberFormat.UInt8LE, 9)
                }
                tag = ""
                switch (mode) {
                    case RecognitionMode.VisualPatrol:
                        angle = available.getNumber(NumberFormat.UInt8LE, 1) - 60
                        return true
                    case RecognitionMode.MachineLearning:
                    case RecognitionMode.Number:
                        tag = available.getNumber(NumberFormat.UInt8LE, 1).toString()
                        return true

                    case RecognitionMode.Image:
                        for (let n = 10; n < data_len + 1; n++) {
                            tag += String.fromCharCode(available.getNumber(NumberFormat.UInt8LE, n))
                        }
                        return true
                    case RecognitionMode.Face:
                        for (let n = 10; n < data_len + 1; n++) {
                            tag += available.getNumber(NumberFormat.UInt8LE, 10)
                        }
                        return true

                    case RecognitionMode.Barcode:
                    case RecognitionMode.QRCode:
                        for (let m = 7; m < Math.min(data_len + 1, available.length); m++) {
                            tag += String.fromCharCode(available.getNumber(NumberFormat.UInt8LE, m));
                        }
                        return true;

                    case RecognitionMode.TrafficCard:
                    case RecognitionMode.TrafficSign:

                        for (let i = 10; i < Math.min(data_len + 1, available.length); i++) {
                            tag += String.fromCharCode(available.getNumber(NumberFormat.UInt8LE, i));
                        }
                        return true
                }
            }
        }
        return false
    }

    //% blockId=clearSerialBuffer block="clearSerialBuffer"
    //% subcategory="Executive"
    //% group="Microbit K210"
    //% weight=85
    export function clearSerialBuffer(): void  {
        while (serial.readBuffer(0) && serial.readBuffer(0).length > 0) {
            serial.readBuffer(0);
        }
    }

    //% blockId=get_code_data block="get %data"
    //% subcategory="Executive"
    //% group="Microbit K210"
    //% weight=85
    export function get_code_data(data: CodeData): string {
        switch (data) {
            case CodeData.X: return x.toString()
            case CodeData.Y: return y.toString()
            case CodeData.W: return w.toString()
            case CodeData.H: return h.toString()
            case CodeData.CenterX: return cx.toString()
            case CodeData.CenterY: return cy.toString()
            case CodeData.Tag: return tag
            case CodeData.Angle: return angle.toString()
            default: return "0"
        }

    }


}
