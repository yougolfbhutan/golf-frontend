interface HeaderIProps{
    text: string;
    className?:string
    containerClass?:string
    
    

   }
const TextCompoment:React.FC<HeaderIProps> = ({text,className,containerClass}) => {
    return(
            <div className={containerClass} >
                <h2 className={className}>{text}</h2>
            </div>
        
    );
};

export default TextCompoment;