import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useCreateIngredient } from "../../data/ingredients";
import { Ingredient } from "../../models/ingredients";

interface AddIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (ingredient: Ingredient) => void;
    ingredientName: string;
}

const AddIngredientModal = ({
    isOpen,
    onClose,
    onCreated,
    ingredientName
}: AddIngredientModalProps) => {
    const { t } = useTranslation();

    const {
        isLoading,
        mutate
    } = useCreateIngredient();


    const toast = useToast();
    const handleCreateIngredient = () => {
        mutate({
            name: ingredientName
        }, {
            onSuccess: (ingredient) => {
                onCreated(ingredient);
                toast({
                    title: t("SelectCocktailIngredients.AddIngredientModal.toasters.success.title"),
                    description: t("SelectCocktailIngredients.AddIngredientModal.toasters.success.description"),
                    position: "top",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (err) => {
                console.error(err);
                toast({
                    title: t("SelectCocktailIngredients.AddIngredientModal.toasters.error.title"),
                    description: t("SelectCocktailIngredients.AddIngredientModal.toasters.error.description"),
                    position: "top",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        });
    }


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />    
            <ModalContent>
                <ModalHeader>
                    {t("SelectCocktailIngredients.AddIngredientModal.title")}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <p>
                        {t("SelectCocktailIngredients.AddIngredientModal.confirmMessage")}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                    >
                        {t("SelectCocktailIngredients.AddIngredientModal.cancel")}
                    </Button>
                    <Button
                        isLoading={isLoading}
                        colorScheme='yellow'
                        onClick={handleCreateIngredient}
                    >
                        {t("SelectCocktailIngredients.AddIngredientModal.cta")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
};

export default AddIngredientModal