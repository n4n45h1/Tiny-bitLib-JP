/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen and enhanced by n4n45h1
load dependency
"Tinybit": "file:../pxt-Tinybit"
日本語版＋追加機能
*/

//% color="#006400" weight=20 icon="\uf1b9"
namespace Tinybit {

    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01
    
    let yahStrip: neopixel.Strip;
    let 自動運転モード = false;
    let 障害物回避距離 = 20;
    let ライン追従感度 = 50;
    let 速度設定 = 150;

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
        //% blockId="Purple" block="紫"
        紫,
        //% blockId="Orange" block="オレンジ"
        オレンジ
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
        右側 = 1,
        //% blockId="Center" block="中央"
        中央 = 2
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

    export enum LEDパターン {
        //% blockId="Solid" block="点灯"
        点灯 = 0,
        //% blockId="Blink" block="点滅"
        点滅 = 1,
        //% blockId="Fade" block="フェード"
        フェード = 2,
        //% blockId="Rainbow" block="虹色"
        虹色 = 3,
        //% blockId="Chase" block="チェイス"
        チェイス = 4
    }

    export enum 自動運転タイプ {
        //% blockId="ObstacleAvoidance" block="障害物回避"
        障害物回避 = 0,
        //% blockId="LineFollowing" block="ライン追従"
        ライン追従 = 1,
        //% blockId="RandomWalk" block="ランダム移動"
        ランダム移動 = 2,
        //% blockId="WallFollowing" block="壁沿い移動"
        壁沿い移動 = 3
    }

    // 既存の基本機能
    function setPwmRGB(red: number, green: number, blue: number): void {
        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    let car_flag_old = 0;
    let car_flag_new = 0;
    
    function setPwmMotor(mode: number, speed1: number, speed2: number): void {
        if (mode < 0 || mode > 6) return;
        
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        switch (mode) { 
            case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;
            case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;
            case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; car_flag_new = 1; break;
            case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;
            case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; car_flag_new = 0; break;
            case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; car_flag_new = 2; break;
            case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; car_flag_new = 3; break;
        }
        
        if(car_flag_new != car_flag_old) {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, bufff);
            basic.pause(100);
            car_flag_old = car_flag_new;
        }
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    // ***** 新しい追加機能 *****

    //% blockId=Tinybit_SetSpeed block="デフォルト速度設定|速度 %speed"
    //% weight=100
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    export function デフォルト速度設定(speed: number): void {
        速度設定 = Math.constrain(speed, 0, 255);
    }

    //% blockId=Tinybit_SmoothMove block="スムーズ移動|方向 %direction|距離 %distance|速度 %speed"
    //% weight=99
    //% blockGap=10
    //% distance.min=1 distance.max=1000 speed.min=50 speed.max=255
    //% color="#006400"
    export function スムーズ移動(direction: カー状態, distance: number, speed: number): void {
        let moveTime = Math.map(distance, 1, 1000, 100, 5000);
        
        // 加速フェーズ
        for(let i = 50; i <= speed; i += 10) {
            カー制御速度(direction, i);
            basic.pause(50);
        }
        
        // 定速フェーズ
        カー制御速度(direction, speed);
        basic.pause(moveTime);
        
        // 減速フェーズ
        for(let i = speed; i >= 0; i -= 10) {
            カー制御速度(direction, i);
            basic.pause(30);
        }
        
        カー制御(カー状態.停止);
    }

    //% blockId=Tinybit_TurnDegrees block="角度回転|角度 %degrees|速度 %speed"
    //% weight=98
    //% blockGap=10
    //% degrees.min=-360 degrees.max=360 speed.min=50 speed.max=255
    //% color="#006400"
    export function 角度回転(degrees: number, speed: number): void {
        let turnTime = Math.abs(degrees) * 10; // 概算の回転時間
        
        if (degrees > 0) {
            カー制御速度(カー状態.右回転, speed);
        } else {
            カー制御速度(カー状態.左回転, speed);
        }
        
        basic.pause(turnTime);
        カー制御(カー状態.停止);
    }

    //% blockId=Tinybit_LEDPattern block="LEDパターン|パターン %pattern|色 %color|速度 %speed"
    //% weight=97
    //% blockGap=10
    //% speed.min=1 speed.max=10
    //% color="#006400"
    export function LEDパターン設定(pattern: LEDパターン, color: カラー, speed: number): void {
        let strip = RGBカープログラム();
        let delay = Math.map(speed, 1, 10, 1000, 100);
        
        switch (pattern) {
            case LEDパターン.点灯:
                strip.clear();
                strip.showColor(getRGBColor(color));
                strip.show();
                break;
                
            case LEDパターン.点滅:
                for(let i = 0; i < 10; i++) {
                    strip.showColor(getRGBColor(color));
                    strip.show();
                    basic.pause(delay);
                    strip.clear();
                    strip.show();
                    basic.pause(delay);
                }
                break;
                
            case LEDパターン.虹色:
                for(let hue = 0; hue < 360; hue += 10) {
                    strip.showColor(neopixel.hsl(hue, 100, 50));
                    strip.show();
                    basic.pause(delay / 10);
                }
                break;
                
            case LEDパターン.チェイス:
                for(let i = 0; i < 20; i++) {
                    strip.clear();
                    strip.setPixelColor(i % strip.length(), getRGBColor(color));
                    strip.show();
                    basic.pause(delay);
                }
                break;
        }
    }

    //% blockId=Tinybit_AutoDrive block="自動運転|タイプ %type|有効 %enabled"
    //% weight=96
    //% blockGap=10
    //% color="#006400"
    export function 自動運転(type: 自動運転タイプ, enabled: boolean): void {
        自動運転モード = enabled;
        
        if (enabled) {
            control.inBackground(() => {
                while (自動運転モード) {
                    switch (type) {
                        case 自動運転タイプ.障害物回避:
                            障害物回避実行();
                            break;
                        case 自動運転タイプ.ライン追従:
                            ライン追従実行();
                            break;
                        case 自動運転タイプ.ランダム移動:
                            ランダム移動実行();
                            break;
                        case 自動運転タイプ.壁沿い移動:
                            壁沿い移動実行();
                            break;
                    }
                    basic.pause(100);
                }
                カー制御(カー状態.停止);
            });
        }
    }

    //% blockId=Tinybit_SetObstacleDistance block="障害物検知距離設定|距離 %distance cm"
    //% weight=95
    //% blockGap=10
    //% distance.min=5 distance.max=100
    //% color="#006400"
    export function 障害物検知距離設定(distance: number): void {
        障害物回避距離 = Math.constrain(distance, 5, 100);
    }

    //% blockId=Tinybit_PlayTone block="音階再生|周波数 %frequency Hz|持続時間 %duration ms"
    //% weight=94
    //% blockGap=10
    //% frequency.min=100 frequency.max=5000 duration.min=100 duration.max=3000
    //% color="#006400"
    export function 音階再生(frequency: number, duration: number): void {
        music.playTone(frequency, duration);
    }

    //% blockId=Tinybit_GetBatteryLevel block="バッテリー残量取得"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    export function バッテリー残量取得(): number {
        // アナログピンから電圧を読み取り、バッテリー残量を推定
        let voltage = pins.analogReadPin(AnalogPin.P0) * 3.3 / 1023;
        let percentage = Math.map(voltage, 2.5, 4.2, 0, 100);
        return Math.constrain(percentage, 0, 100);
    }

    //% blockId=Tinybit_CreatePath block="経路作成|コマンド %commands"
    //% weight=92
    //% blockGap=10
    //% color="#006400"
    export function 経路実行(commands: string): void {
        let commandList = commands.split(",");
        
        for (let cmd of commandList) {
            let parts = cmd.trim().split(" ");
            let action = parts[0];
            let param = parts.length > 1 ? parseInt(parts[1]) : 速度設定;
            
            switch (action.toLowerCase()) {
                case "f": // forward
                case "前進":
                    カー制御速度(カー状態.前進, param);
                    basic.pause(1000);
                    break;
                case "b": // back
                case "後退":
                    カー制御速度(カー状態.後退, param);
                    basic.pause(1000);
                    break;
                case "l": // left
                case "左":
                    カー制御速度(カー状態.左, param);
                    basic.pause(500);
                    break;
                case "r": // right
                case "右":
                    カー制御速度(カー状態.右, param);
                    basic.pause(500);
                    break;
                case "s": // stop
                case "停止":
                    カー制御(カー状態.停止);
                    basic.pause(500);
                    break;
            }
        }
        カー制御(カー状態.停止);
    }

    //% blockId=Tinybit_EmergencyStop block="緊急停止"
    //% weight=91
    //% blockGap=10
    //% color="#ff0000"
    export function 緊急停止(): void {
        自動運転モード = false;
        カー制御(カー状態.停止);
        // 警告LED点滅
        for(let i = 0; i < 10; i++) {
            RGBカー大(カラー.赤);
            basic.pause(100);
            RGBカー大(カラー.消灯);
            basic.pause(100);
        }
        音階再生(1000, 500);
    }

    // ヘルパー関数群
    function getRGBColor(color: カラー): number {
        switch (color) {
            case カラー.赤: return neopixel.colors(NeoPixelColors.Red);
            case カラー.緑: return neopixel.colors(NeoPixelColors.Green);
            case カラー.青: return neopixel.colors(NeoPixelColors.Blue);
            case カラー.白: return neopixel.colors(NeoPixelColors.White);
            case カラー.黄色: return neopixel.colors(NeoPixelColors.Yellow);
            case カラー.シアン: return neopixel.rgb(0, 255, 255);
            case カラー.ピンク: return neopixel.colors(NeoPixelColors.Violet);
            case カラー.紫: return neopixel.colors(NeoPixelColors.Purple);
            case カラー.オレンジ: return neopixel.colors(NeoPixelColors.Orange);
            default: return neopixel.colors(NeoPixelColors.Black);
        }
    }

    function 障害物回避実行(): void {
        let distance = 超音波センサー();
        if (distance < 障害物回避距離) {
            カー制御(カー状態.停止);
            basic.pause(100);
            // ランダムに左右どちらかに回転
            if (Math.randomBoolean()) {
                カー制御速度(カー状態.右回転, 速度設定);
            } else {
                カー制御速度(カー状態.左回転, 速度設定);
            }
            basic.pause(500);
        } else {
            カー制御速度(カー状態.前進, 速度設定);
        }
    }

    function ライン追従実行(): void {
        let leftSensor = ラインセンサー(位置.左側, ライン状態.黒ライン);
        let rightSensor = ラインセンサー(位置.右側, ライン状態.黒ライン);
        
        if (leftSensor && rightSensor) {
            カー制御速度(カー状態.前進, 速度設定);
        } else if (leftSensor) {
            カー制御速度(カー状態.左, 速度設定 * 0.7);
        } else if (rightSensor) {
            カー制御速度(カー状態.右, 速度設定 * 0.7);
        } else {
            カー制御(カー状態.停止);
        }
    }

    function ランダム移動実行(): void {
        let action = Math.randomRange(1, 4);
        let duration = Math.randomRange(500, 2000);
        
        switch (action) {
            case 1: カー制御速度(カー状態.前進, 速度設定); break;
            case 2: カー制御速度(カー状態.左, 速度設定); break;
            case 3: カー制御速度(カー状態.右, 速度設定); break;
            case 4: カー制御速度(カー状態.後退, 速度設定); break;
        }
        
        basic.pause(duration);
        カー制御(カー状態.停止);
        basic.pause(200);
    }

    function 壁沿い移動実行(): void {
        let distance = 超音波センサー();
        let targetDistance = 15; // 壁からの目標距離(cm)
        
        if (distance < targetDistance - 3) {
            // 壁に近すぎる場合、右に少し回転
            カー制御速度(カー状態.右, 速度設定 * 0.6);
            basic.pause(100);
        } else if (distance > targetDistance + 3) {
            // 壁から遠すぎる場合、左に少し回転
            カー制御速度(カー状態.左, 速度設定 * 0.6);
            basic.pause(100);
        } else {
            // 適切な距離の場合、前進
            カー制御速度(カー状態.前進, 速度設定);
        }
    }

    // 既存機能（日本語化済み）
    //% blockId=Tinybit_RGB_Car_Program block="RGBカープログラム"
    //% weight=89
    //% blockGap=10
    //% color="#006400"
    export function RGBカープログラム(): neopixel.Strip {
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 2, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }  

    //% blockId=Tinybit_RGB_Car_Big block="RGBカー大|色 %value"
    //% weight=88
    //% blockGap=10
    export function RGBカー大(value: カラー): void {
        switch (value) {
            case カラー.消灯: setPwmRGB(0, 0, 0); break;
            case カラー.赤: setPwmRGB(255, 0, 0); break;
            case カラー.緑: setPwmRGB(0, 255, 0); break;
            case カラー.青: setPwmRGB(0, 0, 255); break;
            case カラー.白: setPwmRGB(255, 255, 255); break;
            case カラー.シアン: setPwmRGB(0, 255, 255); break;
            case カラー.ピンク: setPwmRGB(255, 0, 255); break;
            case カラー.黄色: setPwmRGB(255, 255, 0); break;
            case カラー.紫: setPwmRGB(128, 0, 128); break;
            case カラー.オレンジ: setPwmRGB(255, 165, 0); break;
        }
    }

    //% blockId=Tinybit_CarCtrl block="カー制御|%index"
    //% weight=87
    //% blockGap=10
    //% color="#006400"
    export function カー制御(index: カー状態): void {
        switch (index) {
            case カー状態.前進: setPwmMotor(1, 255, 255); break;
            case カー状態.後退: setPwmMotor(2, 255, 255); break;
            case カー状態.左: setPwmMotor(3, 255, 255); break;
            case カー状態.右: setPwmMotor(4, 255, 255); break;
            case カー状態.停止: setPwmMotor(0, 0, 0); break;
            case カー状態.左回転: setPwmMotor(5, 255, 255); break;
            case カー状態.右回転: setPwmMotor(6, 255, 255); break;
        }
    }

    //% blockId=Tinybit_CarCtrlSpeed block="カー制御速度|%index|速度 %speed"
    //% weight=86
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    export function カー制御速度(index: カー状態, speed: number): void {
        switch (index) {
            case カー状態.前進: setPwmMotor(1, speed, speed); break;
            case カー状態.後退: setPwmMotor(2, speed, speed); break;
            case カー状態.左: setPwmMotor(3, speed, speed); break;
            case カー状態.右: setPwmMotor(4, speed, speed); break;
            case カー状態.停止: setPwmMotor(0, 0, 0); break;
            case カー状態.左回転: setPwmMotor(5, speed, speed); break;
            case カー状態.右回転: setPwmMotor(6, speed, speed); break;
        }
    }

    //% blockId=Tinybit_Line_Sensor block="ラインセンサー|方向 %direct|値 %value"
    //% weight=85
    //% blockGap=10
    //% color="#006400"
    export function ラインセンサー(direct: 位置, value: ライン状態): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        
        switch (direct) {
            case 位置.左側:
                return pins.digitalReadPin(DigitalPin.P13) == value;
            case 位置.右側:
                return pins.digitalReadPin(DigitalPin.P14) == value;
            default:
                return false;
        }
    }

    //% blockId=Tinybit_Ultrasonic_Car block="超音波センサー距離(cm)を返す"
    //% color="#006400"
    //% weight=84
    //% blockGap=10
    export function 超音波センサー(): number {
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
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
        return Math.floor(length);
    }

    //% blockId=Tinybit_Voice_Sensor block="音声センサー戻り値"
    //% weight=83
    //% blockGap=10
    export function 音声センサー(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

}
