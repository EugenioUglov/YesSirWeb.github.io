class AutocompleteController {
  constructor(hashService, actionBlockService, autocompleteService) {
    this.autocompleteService = autocompleteService;
    this.view = new AutocompleteView();
  }

  bindApplyTags() {
    const that = this;

    /* Get tags */
    if (!localStorage["indexes_actionBlocks_by_tag"]) {
      return;
    }

    const indexes_actionBlocks_by_tag = JSON.parse(
      localStorage["indexes_actionBlocks_by_tag"]
    );
    const tags = Object.keys(indexes_actionBlocks_by_tag);

    this.view.bindApplyTags(applyTagsAutocompleteForInputFields);

    function applyTagsAutocompleteForInputFields(
      input_fields_for_autocomplete
    ) {
      for (const input_field of input_fields_for_autocomplete) {
        that.applyTagsAutocomplete(input_field, tags, onSelect);
      }
    }

    function onSelect() {
      if (
        that.hashService.getCurrentPageName() ===
        that.hashService.getPageNameEnum().main
      ) {
        window.scrollTo(0, 0);
        const actionBlocks_to_show =
          that.actionBlockService.getActionBlocksByPhrase(
            $("#input_field_request").val()
          );
        that.actionBlockService.showActionBlocks(actionBlocks_to_show);
      }
    }
  }

  applyTagsAutocomplete(input_field, tags, callbackSelect) {
    const that = this;
    this.autocompleteService.applyTagsAutocomplete(
      input_field,
      tags,
      callbackSelect
    );
  }
}
