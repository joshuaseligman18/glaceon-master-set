import {
    NewCardFormTestResponse,
    ZNewCardForm,
    ZNewCardFormTest,
    ZNewCardFormTestResponse,
} from "@/lib/types/newCardForm";

export async function runNewCardFormTest(
    formTest: FormData
): Promise<NewCardFormTestResponse> {
    const formData = Object.fromEntries(formTest.entries());
    ZNewCardFormTest.parse(formData);
    const response = await fetch("/api/newCardForm/test", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
            formData as Record<string, string>
        ).toString(),
    });
    if (!response.ok) {
        throw new Error("Failed to create new transaction");
    }
    const res = response.json();
    ZNewCardFormTestResponse.parse(res);
    return res;
}

export async function createNewCard(formTest: FormData) {
    const formData = Object.fromEntries(formTest.entries());
    ZNewCardForm.parse(formData);
    const response = await fetch("/api/newCardForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
            formData as Record<string, string>
        ).toString(),
    });
    if (!response.ok) {
        throw new Error("Failed to create new transaction");
    }
    return response.json();
}
