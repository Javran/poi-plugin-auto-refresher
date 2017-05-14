// enumFromTo(x,y) = [x,x+1,x+2...y]
// only guarantee to work on increasing sequences
const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

function warn(...args) {
  return console.warn.apply(this, args)
}

function error(...args) {
  return console.error.apply(this, args)
}

// "const" function that simply ignores
// its second list of arguments and returns the first argument.
// the funny spell is due to the fact that "const" is a keyword.
const konst = x => () => x

// usage: "ignore(a,b,c)" to fool eslint to believe that "a", "b" and "c"
// are somehow being used, it serves as an explicit annotation to say that they actually don't
const ignore = konst

const not = x => !x

export {
  enumFromTo,
  konst,
  ignore,
  not,

  warn,
  error,
}
