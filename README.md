

In der Datei errorCode sind errors Codes die vom Server zuruckkommen
beispiel wenn der error code kommt wird der Text automaisch ubersetzt wenn in de hinterlegt  

  errorCode  { to_big: "The field {field} may cant be large then {maximum}"}
  translation {"The field {field} may cant be large then {maximum}":   "Das Feld {field} darf nicht größer als {maximum} sein",}
  Der Field Param ist der FormName wenn er in der Ubersetzung da ist wird auch er ubersetzt zb {"age" :"Alter"}
      <BaseInput<UpdateableUserData>
          
                            key={i}
                            name={"age}
            
                        />
// der Server und Client nutzen beide Zod da so immer ein gleiches Fehlerformat raus kommt 
//    const nameParser = Zod.string().min(3, "to_short").max(50, "to_long"); im server umd im client gleich wenn jemand im Client (wie ich bei Fiamo) verkackt die min und max Werte zu setzten  werden sie immer automatisch angezeit
// "to_short" ist der fehlerCode in dem Beispiel der immer mit kommt
// useRequest ubersetzt alle Fehler automatisch mit translateZodError was sonst in react hook form validate kommt  validate =    name: (name: string | undefined) => {
            try {
                nameParser.parse(name);
                return true;
            } catch (e) {
                const error = e as ZodError;
                return translateZodError("name", error, translate);
            }
        },
// {name ist der Field name}  



In der Datei urlParams sind url paramter die zb nach oauth2 kommen