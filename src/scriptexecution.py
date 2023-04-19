import datetime
class executor:
    def __init__(self, argc, argv, funcv):
        self.helprequest(argc, argv)
        if argc < 3:
            executor.errorLog(f'Expected a minimum of 3 arguments, only {argc} were provided')
            exit()
        self.size = argc - 2
        self.args, _arg_size = executor.argify(argv[2:])
        self.function = argv[1]
        if self.function not in funcv.keys():
            executor.errorLog(f'Function "{self.function}" cannot be found in list of known functions {funcv.keys()}')
            exit()
        self.function, self.arg_size = funcv[self.function]
        if self.arg_size != _arg_size:
            executor.errorLog(
                f'Expected {self.arg_size} args for function {self.function.__name__}, but recieved {_arg_size} args.'
            )
            exit()
        

    def execute(self):
        self.function(self.args)

    
    def helprequest(self, argc, argv):
        if argc == 2 and argv[1].lower() in ['help', 'options', '?']:
            executor.print_help_message()
            exit()
    
    @staticmethod
    def errorLog(issue):
        with open('error.log', 'a') as el:
            el.write(f'{datetime.datetime.now()}  {issue}\n\n')

    @staticmethod
    def print_help_message():
        print("Functions: 'forgotPasswordEmail', 'passwordResetEmail', 'passwordResetLink', 'twoStepEmail', 'sendEmail'")
        print("To: 'abc@gmail.com'")
        print("Name: 'John'")
        print("nonse: '275495'")
        print('\nRead the readme file for more info')

    @staticmethod
    def argify(args):
        typer = {'__primary_input__': []}
        buffer_type = ''
        buffer_arg = ''
        open = False
        for arg in args:
            if open:
                if arg[-1] == "'":
                    buffer_arg += f' {arg[:-1]}'
                    open = False
                    buffer_type, buffer_arg = executor.add_to_typer(
                        buffer_type, 
                        buffer_arg, 
                        typer
                    )
                else:
                    buffer_arg += f' {arg}'
            elif arg[0] == '-':
                buffer_type = arg[1:arg.index('=')]
                buffer_arg = arg[arg.index('=')+1:]
                if buffer_arg[0] == "'":
                    open = True
                    buffer_arg = buffer_arg[1:]
                else:
                    buffer_type, buffer_arg = executor.add_to_typer(
                        buffer_type, 
                        buffer_arg,
                        typer
                    )
            elif arg[0] == "'":
                open = True
                buffer_type = '__primary_input__'
                buffer_arg = arg[1:]
            else:
                executor.add_to_typer(
                    '__primary_input__',
                    arg,
                    typer
                )
        return typer, len(typer['__primary_input__'])
                
            
    @staticmethod
    def add_to_typer(tp, arg, typer):
        if tp == '__primary_input__':
            typer[tp].append(arg)
        else:
            typer[tp] = arg
        return '', ''