/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"Tinybit": "file:../pxt-Tinybit"
日本語版に修正
*/

//% color="#006400" weight=20 icon="\uf1b9"
namespace Tinybit {

    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01
    
    let yahStrip: neopixel.Strip;

    export enum カラー {

        //% blockId="OFF" block="消灯"
        消灯 = 0,
        //% blockId="Red" block="赤"
        赤,
        //% blockId="Green" block="緑"
        緑,
        //% blockId="Blue" block="青"
        青,
        //% blockId="White" block="白"
        白,
        //% blockId="Cyan" block="シアン"
        シアン,
        //% blockId="Pinkish" block="ピンク"
        ピンク,
        //% blockId="Yellow" block="黄色"
        黄色,

    }
    export enum 音楽 {

        //% blockId="dadadum" block="ダダダダム"
        ダダダダム = 0,
        //% blockId="entertainer" block="エンターテイナー"
        エンターテイナー,
        //% blockId="prelude" block="前奏曲"
        前奏曲,
        //% blockId="ode" block="頌歌"
        頌歌,
        //% blockId="nyan" block="ニャーン"
        ニャーン,
        //% blockId="ringtone" block="着信音"
        着信音,
        //% blockId="funk" block="ファンク"
        ファンク,
        //% blockId="blues" block="ブルース"
        ブルース,
        //% blockId="birthday" block="誕生日"
        誕生日,
        //% blockId="wedding" block="結婚式"
        結婚式,
        //% blockId="funereal" block="葬儀"
        葬儀,
        //% blockId="punchline" block="オチ"
        オチ,
        //% blockId="baddy" block="悪役"
        悪役,
        //% blockId="chase" block="追跡"
        追跡,
        //% blockId="ba_ding" block="バーディン"
        バーディン,
        //% blockId="wawawawaa" block="ワワワワー"
        ワワワワー,
        //% blockId="jump_up" block="ジャンプアップ"
        ジャンプアップ,
        //% blockId="jump_down" block="ジャンプダウン"
        ジャンプダウン,
        //% blockId="power_up" block="パワーアップ"
        パワーアップ,
        //% blockId="power_down" block="パワーダウン"
        パワーダウン

    }
    export enum 位置 {

        //% blockId="LeftState" block="左側"
        左側 = 0,
        //% blockId="RightState" block="右側"
        右側 = 1
    }

    export enum ライン状態 {
        //% blockId="White" block="白ライン"
        白ライン = 0,
        //% blockId="Black" block="黒ライン"
        黒ライン = 1
    }
    
    
    export enum カー状態 {
        //% blockId="Car_Run" block="前進"
        前進 = 1,
        //% blockId="Car_Back" block="後退"
        後退 = 2,
        //% blockId="Car_Left" block="左"
        左 = 3,
        //% blockId="Car_Right" block="右"
        右 = 4,
        //% blockId="Car_Stop" block="停止"
        停止 = 5,
        //% blockId="Car_SpinLeft" block="左回転"
        左回転 = 6,
        //% blockId="Car_SpinRight" block="右回転"
        右回転 = 7
    }

    function setPwmRGB(red: number, green: number, blue: number): void {

        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;
        
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    let car_flag_old = 0; //0：両モーター正転 1：両モーター反転 2:左旋回 3：右旋回
    let car_flag_new = 0; //0：両モーター正転 1：両モーター反転 2:左旋回 3：右旋回
    function setPwmMotor(mode: number, speed1: number, speed2: number): void {
        if (mode < 0 || mode > 6)
            return;
        
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        switch (mode) { 
            case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;              //停止
            case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;    //前進
            case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; car_flag_new = 1; break;    //後退
            case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0;      break;    //左
            case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; car_flag_new = 0;      break;    //右
            case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; car_flag_new = 2; break;    //左回転
            case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; car_flag_new = 3; break;    //右回転
        }
        if(car_flag_new != car_flag_old) //前回の状態が正転、今回が反転の場合
        {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, buf);//100ms停止
            basic.pause(100);
            car_flag_old = car_flag_new;
        }
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    function Car_run(speed1: number, speed2: number) {
        setPwmMotor(1, speed1, speed2);
    }

    function Car_back(speed1: number, speed2: number) {
        setPwmMotor(2, speed1, speed2);
    }

    function Car_left(speed1: number, speed2: number) {
        setPwmMotor(3, speed1, speed2);
    }

    function Car_right(speed1: number, speed2: number) {
        setPwmMotor(4, speed1, speed2);
    }

    function Car_stop() {
        setPwmMotor(0, 0, 0);
    }

    function Car_spinleft(speed1: number, speed2: number) {
        setPwmMotor(5, speed1, speed2);
    } 

    function Car_spinright(speed1: number, speed2: number) {
        setPwmMotor(6, speed1, speed2);
    }

    /**
     * *****************************************************************
     * @param index
     */   

    //% blockId=Tinybit_RGB_Car_Program block="RGBカープログラム"
    //% weight=99
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGBカープログラム(): neopixel.Strip {
         
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 2, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }  

    //% blockId=Tinybit_RGB_Car_Big block="RGBカー大|色 %value"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGBカー大(value: カラー): void {

        switch (value) {
            case カラー.消灯: {
                setPwmRGB(0, 0, 0);
                break;
            }
            case カラー.赤: {
                setPwmRGB(255, 0, 0);
                break;
            }
            case カラー.緑: {
                setPwmRGB(0, 255, 0);
                break;
            }
            case カラー.青: {
                setPwmRGB(0, 0, 255);
                break;
            }
            case カラー.白: {
                setPwmRGB(255, 255, 255);
                break;
            }
            case カラー.シアン: {
                setPwmRGB(0, 255, 255);
                break;
            }
            case カラー.ピンク: {
                setPwmRGB(255, 0, 255);
                break;
            }
            case カラー.黄色: {
                setPwmRGB(255, 255, 0);
                break;
            }
        }
    }
    //% blockId=Tinybit_RGB_Car_Big2 block="RGBカー大2|赤 %value1|緑 %value2|青 %value3"
    //% weight=97
    //% blockGap=10
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGBカー大2(value1: number, value2: number, value3: number): void {

        setPwmRGB(value1, value2, value3);

    }
    //% blockId=Tinybit_Music_Car block="音楽カー|%index"
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function 音楽カー(index: 音楽): void {
        switch (index) {
            case 音楽.ダダダダム: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case 音楽.誕生日: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case 音楽.エンターテイナー: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case 音楽.前奏曲: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case 音楽.頌歌: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case 音楽.ニャーン: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case 音楽.着信音: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case 音楽.ファンク: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case 音楽.ブルース: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case 音楽.結婚式: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case 音楽.葬儀: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case 音楽.オチ: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case 音楽.悪役: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case 音楽.追跡: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case 音楽.バーディン: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case 音楽.ワワワワー: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case 音楽.ジャンプアップ: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case 音楽.ジャンプダウン: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case 音楽.パワーアップ: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case 音楽.パワーダウン: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }
    
    
    
    //% blockId=Tinybit_CarCtrl block="カー制御|%index"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function カー制御(index: カー状態): void {
        switch (index) {
            case カー状態.前進: Car_run(255, 255); break;
            case カー状態.後退: Car_back(255, 255); break;
            case カー状態.左: Car_left(255, 255); break;
            case カー状態.右: Car_right(255, 255); break;
            case カー状態.停止: Car_stop(); break;
            case カー状態.左回転: Car_spinleft(255, 255); break;
            case カー状態.右回転: Car_spinright(255, 255); break;
        }
    }
    
    //% blockId=Tinybit_CarCtrlSpeed block="カー制御速度|%index|速度 %speed"
    //% weight=92
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function カー制御速度(index: カー状態, speed: number): void {
        switch (index) {
            case カー状態.前進: Car_run(speed, speed); break;
            case カー状態.後退: Car_back(speed, speed); break;
            case カー状態.左: Car_left(speed, speed); break;
            case カー状態.右: Car_right(speed, speed); break;
            case カー状態.停止: Car_stop(); break;
            case カー状態.左回転: Car_spinleft(speed, speed); break;
            case カー状態.右回転: Car_spinright(speed, speed); break;
        }
    }
    
    //% blockId=Tinybit_CarCtrlSpeed2 block="カー制御速度2|%index|速度1 %speed1|速度2 %speed2"
    //% weight=91
    //% blockGap=10
    //% speed1.min=0 speed1.max=255 speed2.min=0 speed2.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function カー制御速度2(index: カー状態, speed1: number, speed2: number): void {
        switch (index) {
            case カー状態.前進: Car_run(speed1, speed2); break;
            case カー状態.後退: Car_back(speed1, speed2); break;
            case カー状態.左: Car_left(speed1, speed2); break;
            case カー状態.右: Car_right(speed1, speed2); break;
            case カー状態.停止: Car_stop(); break;
            case カー状態.左回転: Car_spinleft(speed1, speed2); break;
            case カー状態.右回転: Car_spinright(speed1, speed2); break;
        }
    }    
        
   
    
    //% blockId=Tinybit_Line_Sensor block="ラインセンサー|方向 %direct|値 %value"
    //% weight=89
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function ラインセンサー(direct: 位置, value: ライン状態): boolean {

        let temp: boolean = false;
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        switch (direct) {
            case 位置.左側: {
                if (pins.digitalReadPin(DigitalPin.P13) == value) {              
                    temp = true;                  
                }
                else {                  
                     temp = false;
                }
                break;
            }

            case 位置.右側: {
                if (pins.digitalReadPin(DigitalPin.P14) == value) {              
                    temp = true;                  
                }
                else {
                    temp = false;
                }
                break;
            }
        }
        return temp;

    }

    //% blockId=Tinybit_Voice_Sensor block="音声センサー戻り値"
    //% weight=88
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function 音声センサー(): number {
	    //pins.setPull(DigitalPin.P1, PinPullMode.PullUp);
        let temp  = 0;		
        temp = pins.analogReadPin(AnalogPin.P1);           
            
        return temp;

    }
        
    //% blockId=Tinybit_Ultrasonic_Car block="超音波センサー距離(cm)を返す"
    //% color="#006400"
    //% weight=87
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function 超音波センサー(): number {

       	let list:Array<number> = [0, 0, 0, 0, 0];
				for (let i = 0; i < 5; i++)
				{
					pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
					pins.digitalWritePin(DigitalPin.P16, 0);
					control.waitMicros(2);
					pins.digitalWritePin(DigitalPin.P16, 1);
					control.waitMicros(15);
					pins.digitalWritePin(DigitalPin.P16, 0);
					let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
					list[i] = Math.floor(d / 40);
				}
				list.sort();
				let length = (list[1] + list[2] + list[3])/3;
				return  Math.floor(length);
    }
        
    //% blockId=Tinybit_Ultrasonic_CarV2 block="V2用超音波センサー距離(cm)を返す"
    //% color="#006400"
    //% weight=87
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function V2用超音波センサー(): number {
		pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
		pins.digitalWritePin(DigitalPin.P16, 0);
		control.waitMicros(4);
		pins.digitalWritePin(DigitalPin.P16, 1);
		control.waitMicros(10);
		pins.digitalWritePin(DigitalPin.P16, 0);

		let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 500 * 58);
        return  Math.floor(d / 58);

    }

    //% blockId=Tinybit_motor_pid block="モーターPID制御|左モーター:%sp_L|右モーター:%sp_R"
    //% color="#006400"
    //% weight=87
    //% sp_L.min=-255 sp_L.max=255  sp_R.min=-255 sp_R.max=255
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function モーター制御(sp_L:number,sp_R:number)
    {
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;

        if (sp_L < 0)//反転
        {
            buf[1] = 0;
            buf[2] = -sp_L;
        }
        else //正転
        {
            buf[1] = sp_L;
            buf[2] = 0;
        }

        if (sp_R < 0)//反転
        {
            buf[3] = 0;
            buf[4] = -sp_R;
        }
        else //正転
        {
            buf[3] = sp_R;
            buf[4] = 0;
        }

        if(sp_L>=0 && sp_R>=0) //前進、左、右
        {
            car_flag_new = 0;
        }
        else if(sp_L<0 && sp_R<0)//後退
        {
            car_flag_new = 1;
        }
        else if(sp_L>0 && sp_R<0)//左回転
        {
            car_flag_new = 2;
        }
        else if(sp_L<0 && sp_R>0)//右回転
        {
            car_flag_new = 3;
        }


        if(car_flag_new != car_flag_old) //状態が変化した場合
        {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, buf);//100ms停止
            basic.pause(100);
            car_flag_old = car_flag_new;
        }

        pins.i2cWriteBuffer(PWM_ADD, buf);

    }


}
