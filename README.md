# animated-background

웹 애니메이트 배경

![image](https://user-images.githubusercontent.com/34199905/155535188-337c039e-53b1-4e40-9055-1d43749f74b8.png)

## Example

[example-star](https://soju06.github.io/animated-background/example/example-star.html)

[example-down-star](https://soju06.github.io/animated-background/example/example-down-star.html)

[example-firefly](https://soju06.github.io/animated-background/example/example-firefly.html)

[sample-1](https://soju06.github.io/animated-background/example/sample-1.html)

## How to use

1. [abg.min.js](https://raw.github.com/Soju06/animated-background/main/src/abg.min.js) 를 작업 영역에 구성합니다.

2. 배경 캔버스를 만듭니다.

   ```html
   <!DOCTYPE html>
   <html>
       <head>
         <style>
           .spaceBackground {
             position: absolute;
             left: 0;
             right: 0;
             top: 0;
             bottom: 0;
             width: 100%;
             height: 100%;
             z-index: -1000;
             background-color: #000;
           }
         </style>
       </head>
       <body>
         <canvas id="background" class="spaceBackground"></canvas>
           
         <script src="./abg.js"></script>
       </body>
   </html>
   ```

3. 배경 캔버스 정의합니다.

   ```html
   <script>
       animatedCanvas(document.getElementById('background'), {
       	draw: drawFunction('star', undefined, 'fade radial_gradient')
       })
   </script>
   ```

4. 스타일 변경 (options)

   **애니메이션**

   - 하늘로 향하는 별

     ```js
     animatedCanvas(element, {
         draw: drawFunction('star')
     })
     ```

   - 반딧불이

     ```js
     animatedCanvas(element, {
         draw: drawFunction('firefly')
     })
     ```

   - 하늘로 향하는 별, 반딧불이 옵션

     ```js
     {
         baseSize: 2560 * 1440, // 1 이상
         dots: [ // 1개 이상
             // size, count 양수만
             { size: 1, speed: 0.3, count: 400 },
             { size: 2, speed: 0.2, count: 100 },
             { size: 3, speed: 0.1, count: 70 },
             { size: 4, speed: 0.09, count: 30 }
         ],
         dotAlpha: 250, // 0 ~ 255
         dotColor: '#ffffff', // #??????, # + 6자 형식
         backgroundColorSteps: { // KEY 0 ~ 1
             0: '#1B2735', // #??????, # + 6자 형식
             1: '#090A0F' // #??????, # + 6자 형식
         },
         fadeSpeed: 1, // 소숫점 불가
     }
     ```

   **배경**

   - 원 그라데이션

     단일 함수

     ```js
     drawBackgroundFunction('radial_gradient')
     ```

     drawFunction background

     ```js
     animatedCanvas(element, {
         draw: drawFunction('firefly', undefined, 'radial_gradient')
     })
     ```

     페이드-인 플래그

     ```js
     drawBackgroundFunction('radial_gradient fade')
     ```

## Function

- **animatedCanvas** ( `element`, `options` )

  애니메이션 캔버스를 만듭니다.

  Args:

  - element: 필수

  - options: {

    - baseSize: 베이스 스크린 크기 (w * h) (def: 2560 * 1440)
    - draw: {
      - onresize: function (view) 필수 아님
      - setsize: function (view) 필수 아님
      - invalidate: function (view, context, width, height, is_reset?) 필수
      - draw: function (view, context, width, height, is_reset?) 필수
      - drawBackground: function (view, context, width, height, is_reset?) 필수
      - animation: function (view) 필수 아님

    ​	}

    }

- **drawFunction** (`name`, `draw` = null, `backgroundName` = null)

  미리 정의된 애니메이션 함수 셋을 가져옵니다.

  Args:

  - name: [firefly, star] 필수
  - draw: draw 함수 오버라이딩 필수 아님
  - backgroundName: [fade | radial_gradient] 필수 아님

- **drawBackgroundFunction** (name)

  미리 정의된 배경 함수를 가져옵니다.

  Args:

  - name: [fade | radial_gradient] 필수


[reference](https://codepen.io/saransh/pen/LYGbwj)


©️ Soju06 - MIT Licence
