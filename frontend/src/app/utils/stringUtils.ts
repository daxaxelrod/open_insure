export const maybePluralize = (count: number, noun: string, suffix: string = 's') => {
    return `${noun}${count !== 1 ? suffix : ''}`;
  }
  
  export const getFirstLastInitial = (name: string) => {
    try {
        if (name != undefined && name.indexOf(' ') >= 0) {
            let split = name.split(" ");
            if (split.length === 2) {
                // david axelrod
                return split[0] + " " + split[1][0];
            } else if (split.length >= 3) {
                return split[0] + " " + split[split.length - 1][0]
            } else if (split.length === 1) {
                return name
            }
        }    
    } catch (e) {
        console.log("error formatting name name", e);
        return ""
    }
    
  }
  
  export function truncate( str: string, n: number, useWordBoundary: boolean ){
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.substr(0, subString.lastIndexOf(" ")) 
      : subString) + "...";
  };
