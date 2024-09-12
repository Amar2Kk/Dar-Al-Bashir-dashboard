import { Separator } from "./ui/separator";

const Footer = () => {
    return (
        <footer className="text-gray-800 hover:cursor-pointer">
            <Separator className="my-6" />
            <div className="text-center">
                <p>
                    Copyright © 2024 - {""}
                    <a
                        className="font-semibold hover:text-gray-500"
                        href="https://vortixsolutions.com/"
                    >
                        Vortix
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
