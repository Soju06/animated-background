"use strict";

function animatedCanvas(element, options = undefined) {
    options ??= {}
    options.draw ??= {}

    let view = {
        width: 0,
        height: 0,
        scale: 0,
        baseSize: options.baseSize ?? 2560 * 1440,
        element: element,
        context: element.getContext("2d"),
        options: options,
        draw: {
            onresize: options.draw.onresize ?? function (view) {
                view.draw.setsize(view)
                view.draw.invalidate(view, view.context, view.width, view.height, false)
            },
            setsize: options.draw.setsize ?? function (view) {
                view.width = element.width = element.offsetWidth
                view.height = element.height = element.offsetHeight
                view.scale = (view.width * view.height) / view.baseSize
            },
            invalidate: options.draw.invalidate,
            draw: options.draw.draw,
            drawBackground: options.draw.drawBackground,
            animation: function (view) {          
                requestAnimationFrame(function () {
                let con = view.context, w = view.width, h = view.height
                view_draw.drawBackground(view, con, w, h, false)
                view_draw.draw(view, con, w, h, false)
                view.draw.animation(view)
                })
            }
        }
    }

    let view_draw = view.draw
    view_draw.setsize(view)
    view_draw.invalidate(view, view.context, view.width, view.height, true)

    window.onresize = function () {
        view_draw.onresize(view)
    }

    view_draw.animation(view)
}

function drawFunction(name, draw = null, backgroundName = null) {
    name = name.toLowerCase()
    let _draw
    if (name == 'firefly') {
        _draw = {
            invalidate: function (view, con, w, h, reset) {
                    view._dotColor ??= view.options.dotColor ?? '#ffffff'
                    view._dotAlpha ??= Math.min(255, Math.max(0, view.options.dotAlpha ?? 255))
                    view._viewalpha ??= 255
                    view.options.dots ??= [
                        { size: 1, speed: 0.3, count: 400 },
                        { size: 2, speed: 0.2, count: 100 },
                        { size: 3, speed: 0.1, count: 70 },
                        { size: 4, speed: 0.09, count: 30 }
                    ];

                    view._dots = []
                    makeDot(view, w, h, true)
                    view.draw.drawBackground(view, con, w, h, reset)
                    view.draw.draw(view, con, w, h, true)
                },
            draw: function (view, con, w, h) {
                let dots = view._dots
                for (let dot of dots) {
                    let size = dot.size
                    if (dot.x < -size || dot.y < -size || dot.x > w + size || dot.y > h + size) respawnDot(dot, w, h)
                    
                    dot.x += dot.speedx
                    dot.y += dot.speedy
                    
                    if (dot.age++ < 255 || view._dotAlpha < 255 || view._viewalpha < 255) 
                        con.fillStyle = view._dotColor + Math.min(dot.age, view._viewalpha, view._dotAlpha).toString(16).padStart(2, '0')
                    else con.fillStyle = view._dotColor
                    con.fillRect(dot.x, dot.y, size, size)
                }
            },
            drawBackground: drawBackgroundFunction(backgroundName ?? 'radial_gradient')
        }

        function makeDot(view, w, h, reset) {
            for (let info of view.options.dots) {
                let speed = info.speed * view.scale
                let count = info.count * view.scale
                for (let i = 0; i < count; i++) 
                    view._dots.push(respawnDot({ 
                            size: info.size,
                            speed: speed
                        }, w, h, reset))
            }
        }

        function respawnDot(dot, w, h, reset = false) {
            let speed = dot.speed
            dot.age = reset ? 255 : 0
            dot.speedx = rand(-speed * 1000, speed * 1000) * 0.001
            dot.speedy = rand(-speed * 1000, speed * 1000) * 0.001
            dot.x = rand(0, w - dot.size) 
            dot.y = rand(0, h - dot.size)
            return dot
        }
    } else if (name == 'star') {
        _draw = {
            invalidate: function (view, con, w, h, reset) {
                view._dotColor ??= view.options.dotColor ?? '#ffffff'
                view._dotAlpha ??= Math.min(255, Math.max(0, view.options.dotAlpha ?? 255))
                view._viewalpha ??= 255
                view.options.dots ??= [
                    { size: 1, speed: 0.3, count: 400 },
                    { size: 2, speed: 0.2, count: 100 },
                    { size: 3, speed: 0.1, count: 70 },
                    { size: 4, speed: 0.09, count: 30 }
                ];

                view._dots = []
                makeDot(view, w, h)
                view.draw.drawBackground(view, con, w, h, reset)
                view.draw.draw(view, con, w, h, true)
            },
            draw: function (view, con, w, h) {
                let dots = view._dots
                for (let dot of dots) {
                    let size = dot.size
                    dot.y -= dot.speed
                    if (dot.y + size < 0) dot.y = h
                    if (dot.y > h + size) dot.y = -size
                    if (view._dotAlpha < 255 || view._viewalpha < 255) 
                    con.fillStyle = view._dotColor + Math.min(255, view._viewalpha, view._dotAlpha).toString(16).padStart(2, '0')
                    else con.fillStyle = view._dotColor
                    con.fillRect(dot.x, dot.y, size, size)
                }
            },
            drawBackground: drawBackgroundFunction(backgroundName ?? 'radial_gradient')
        }

        function makeDot(view, w, h) {
            for (let info of view.options.dots) {
                let speed = info.speed * view.scale
                let count = info.count * view.scale
                for (let i = 0; i < count; i++) view._dots.push({ 
                    size: info.size,
                    speed: speed,
                    x: rand(0, w - info.size), 
                    y: rand(0, h - info.size) 
                })
            }
        }
    } else {
        throw 'Unknown function name'
    }
    
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return draw != undefined ? Object.assign(_draw, draw) : _draw
}

function drawBackgroundFunction(name) {
    let flags = name.split(' ')
    if (flags.includes('radial_gradient')) {
        if (flags.includes('fade'))
            return function (view, con, w, h, reset = false) {
                if (!view._viewalpha || reset) view._viewalpha = 0
                let alpha = ''
                if (view._viewalpha < 255) {
                    alpha = Math.round(Math.min(view._viewalpha += (view.options.fadeSpeed ?? 1), 255))
                        .toString(16).padStart(2, '0')
                }
                let g = con.createRadialGradient(w / 2, h / 2, (w + h) / 6, w / 2, h / 2, h)
                let steps = view.options.backgroundColorSteps ??= { 0: '#1B2735', 1: '#090A0F' }
                for (let i in steps) {
                    g.addColorStop(i, steps[i] + alpha)
                    g.addColorStop(i, steps[i] + alpha)
                }
                con.fillStyle = g
                con.fillRect(0, 0, w, h)
            }
        else
            return function (view, con, w, h) {
                let g = con.createRadialGradient(w / 2, h / 2, (w + h) / 6, w / 2, h / 2, h)
                let steps = view.options.backgroundColorSteps ??= { 0: '#1B2735', 1: '#090A0F' }
                for (let i in steps) {
                    g.addColorStop(i, steps[i])
                    g.addColorStop(i, steps[i])
                }
                con.fillStyle = g
                con.fillRect(0, 0, w, h)
            }
    } else {
        throw 'Unknown function name'
    }
}
